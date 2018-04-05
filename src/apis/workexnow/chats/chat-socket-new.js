import chatManager from "./chat-socket-method";
import socketLog from "./socket-log";
import auth from "../../../middleware/auth";
import chalk from "chalk";
import UserProfileDataManger from "../../../data-manager/UserProfileDataManager";
import PushNotificaiton from "../../../push-notification/atsNotification";
import jobApplication from "../jobs/job-application";
import {CHAT_STATUS_DELIVERED, CHAT_STATUS_SEEN, CHAT_STATUS_SENT, socket_constants, WxSockets} from "./chat-constants";

let server = require('http').createServer();
let io = require('socket.io')(server);

let config = require('config');
let port = config.get('socket').port;
let userIdToSocketMap = new Map();

// Require user for private endpoints
const authenticateUser = [
    auth.authenticate.authenticateUser
];

let checkUserAndAddToSocketMap = (user_id, socket) => {
    let oldSocket = userIdToSocketMap.get(user_id);
    if (oldSocket) {
        oldSocket.disconnect(true);
        socketLog.logError(`user socket with same id user_id: ${user_id} all ready exist, now disconnected that and connect with new socket`);
    }
    userIdToSocketMap.set(user_id, socket);
};

io.on('connection', clientSocket => {

    // for wildcard events
    let onevent = clientSocket.onevent;
    clientSocket.onevent = function (packet) {
        var args = packet.data || [];
        onevent.call(this, packet);    // original call
        packet.data = ["*"].concat(args);
        onevent.call(this, packet);      // additional call to catch-all
    };

    let {
        CHAT, DISCONNECT, CHAT_STATUS, USER_STATUS, JOB_APPLICATION_INTEREST,
        JOB_INTEREST, OFFER_LETTER, INTERVIEW, ECHO, ERROR, NOTIFICATION, CARD_ACTION,
    } = socket_constants;

    let broadcast_online = (user_id) => {
        //todo: Filter Broadcast to Relevant users
        WxSockets.broadcast(clientSocket, USER_STATUS, [{user_id: user_id, is_online: true}]);
    };

    let broadcast_offline = (user_id) => {
        //todo: Filter Broadcast to Relevant users
        WxSockets.broadcast(clientSocket, USER_STATUS, [{user_id: user_id, is_online: false}]);
    };

    let onConnection = () => {
        let _id = clientSocket.handshake.query['user_id'];
        if (_id) {
            //register Socket
            // todo: Handle-multiple-client-sockets for same _id
            // Currently if will replace the existing socket. Hence, if the user is logged in from any other device
            // he will not get any message.
            checkUserAndAddToSocketMap(_id, clientSocket);
            //WxSockets.emit(clientSocket, REGISTER, {});

            //todo: Send Undelivered Messages.
            chatManager.getUndeliveredMsg(_id)
                .then(results => {
                    WxSockets.emit(clientSocket, CHAT, results);
                });

            broadcast_online(_id);

            WxSockets.emit(clientSocket, 'client_reconnected', clientSocket.handshake.query);

            //logging
            socketLog.logList("New connection", userIdToSocketMap);
        } else {
            socketLog.logError("SIGN_IN without id!!!!");
            clientSocket.disconnect(true);
        }
    };

    let onDisconnect = (data) => {
        let _id = clientSocket.handshake.query['user_id'];

        broadcast_offline(_id);
        userIdToSocketMap.delete(_id);
        socketLog.logSocketDisconnected(_id, userIdToSocketMap.size);

        //logingn
        socketLog.logList("disconnect connection", userIdToSocketMap);
    };

    let onChatReceived = async (data) => {
        //TODO: ask mobile team only send thease paramaters
        let {sender, receiver, message_guid, generated_at, text} = data;
        let socket_receiver = userIdToSocketMap.get(receiver);

        //todo: Check Time authenticity.
        let objectToEmit = {
            for_user: receiver, sender, receiver, type: 'in',
            message_guid, generated_at, text, template: "text",
            server_time: new Date(),
            sent_time: new Date(), //todo: is it required?
        };

        //todo: save objectToEmit into database.
        chatManager.saveChat(data)
            .then((result) => {
                // send Message to the Receiver.
                WxSockets.emit(socket_receiver, CHAT, objectToEmit);
                WxSockets.emit(clientSocket, CHAT_STATUS, [{
                    message_guid,
                    status: CHAT_STATUS_SENT,
                    sender,
                    receiver: receiver
                }]);
            });


        let [name, subscriber_id] = await Promise.all([
            UserProfileDataManger.getUserName(sender),
            UserProfileDataManger.getUserSubscriberId(receiver),
        ]);

        PushNotificaiton.sendChatPush(subscriber_id, {name, text});
    };

    let onCheckUserStatusCalled = (data) => {
        let {for_id} = data;
        let userSocket = userIdToSocketMap.get(for_id);
        WxSockets.emit(clientSocket, USER_STATUS, {user_id: for_id, is_online: !!userSocket});
    };

    /*
     DELIVERED OR SEEN
     CHAT STATUS: {message_guid, status, sender, user_time}
     */
    //todo: in case of seen event, it would normally be applicable for all pending messages. Should not be message by message.
    //todo: handle the case the user if offline, How will you send him this update later, when he come online.
    let onChatStatusUpdated = (data = {}) => {
        let {sender, message_guid, status} = data;
        //todo: check by_user_id is required or not
        data.by_user_id = clientSocket.handshake.query["user_id"];
        data.receiver = clientSocket.handshake.query["user_id"];
        let senderSocket = userIdToSocketMap.get(sender);
        //todo: make it generic as delivered, and received.
        if (status === CHAT_STATUS_DELIVERED) {
            chatManager.markAsDelivered(message_guid)
                .then((result) => {
                    data.msg_flow = 'out';
                    WxSockets.emit(senderSocket, CHAT_STATUS, [data]);
                });
        } else if (status === CHAT_STATUS_SEEN) {
            chatManager.markAsRead(message_guid)
                .then((result) => {
                    data.msg_flow = 'out';
                    WxSockets.emit(senderSocket, CHAT_STATUS, [data]);
                });
        } else {
            console.log(chalk.red("CHATS : invalid chat message status ", status));
        }
    };


    let onOfferLetterAction = async (data = {}, callback) => {
        let {is_accepted: is_offer_letter_accepted, job_id} = data;
        let user_id = clientSocket.handshake.query['user_id'];
        let user = await UserProfileDataManger.findOne({_id: user_id});
        let response = {};
        if (is_offer_letter_accepted === true)
            response = await jobApplication.eeAcceptOfferLetter(null, {user, params: {job_id}});
        else if (is_offer_letter_accepted === false)
            response = await jobApplication.eeRejectOfferLetter(null, {user, params: {job_id}});
        else
            console.log(chalk.red("is_offer_letter_accepted is not passed on event OFFER_LETTER"), data);
        return response;
    };

    let onJobInterestAction = async (data = {}, callback) => {
        let {is_accepted: is_job_interest_accepted, job_id} = data;
        let user_id = clientSocket.handshake.query['user_id'];
        let user = await UserProfileDataManger.findOne({_id: user_id});
        let response = {};
        if (is_job_interest_accepted === true)
            response = await jobApplication.eeInterested(null, {user, params: {job_id}});
        else if (is_job_interest_accepted === false)
            response = await jobApplication.eeNotInterested(null, {user, params: {job_id}});
        else {
            response = {error: {code: 'invalid_payload', message: 'is_accepted not found'}};
            console.log(chalk.red("is_job_interest_accepted is not passed on event JOB_INTEREST"), data);
        }
        return response;
    };

    let onJobApplicationAction = async (data = {}, callback) => {
        let {is_accepted: is_job_application_accepted, job_id, candidate_id} = data;
        let response = {};
        if (!candidate_id) {
            response = {error: {code: 'invalid_payload', message: 'candidate_id not found'}};
            console.log(chalk.red("candidate_id id not passed on event JOB_APPLICATION_INTEREST"), data);
        } else {
            let employerId = clientSocket.handshake.query['user_id'];
            let user = await UserProfileDataManger.findOne({_id: employerId});
            if (is_job_application_accepted === true)
                response = await jobApplication.erShortList(null, {user, params: {job_id, user_id: candidate_id}});
            else if (is_job_application_accepted === false)
                response = await jobApplication.erReject(null, {user, params: {job_id, user_id: candidate_id}});
            else {
                response = {error: {code: 'invalid_payload', message: 'is_accepted not found'}};
                console.log(chalk.red("is_job_application_accepted is not passed on event JOB_APPLICATION_INTEREST", data));
            }
        }
        return response;
    };

    let onInterviewAction = async (data = {}, callback) => {

    };

    let onCardAction = async (data = {}, callback) => {
        try {

            let {action, payload = {}} = data;
            if (payload.is_accepted === null || payload.is_accepted === undefined) {
                callback({error: {code: 'invalid_payload', message: 'Is accepted not found'}});
            }
            let response = {};
            switch (action) {
                case  JOB_APPLICATION_INTEREST:
                    response = await onJobApplicationAction(payload);
                    break;
                case  OFFER_LETTER:
                    response = await onOfferLetterAction(payload);
                    break;
                case  JOB_INTEREST:
                    response = await onJobInterestAction(payload);
                    break;
                case  INTERVIEW:
                    break;
                default:
                    response = {error: {code: 'action_not_found', message: 'Request action not found on server'}};
            }
            console.log("SOCKET CALLBACK Response => ", response);
            callback(response);
        } catch (err) {
            callback({error: {code: 'action_not_found', message: err.message}});
        }
    };

    clientSocket.on(CHAT_STATUS, onChatStatusUpdated);
    clientSocket.on(USER_STATUS, onCheckUserStatusCalled);
    clientSocket.on(CHAT, onChatReceived);


    clientSocket.on(CARD_ACTION, onCardAction);

    //remove this action
    clientSocket.on(JOB_INTEREST, onJobInterestAction);
    clientSocket.on(JOB_APPLICATION_INTEREST, onJobApplicationAction);
    clientSocket.on(OFFER_LETTER, onOfferLetterAction);
    //


    //TODO: interview
    clientSocket.on(INTERVIEW, onInterviewAction);

    clientSocket.on(DISCONNECT, onDisconnect);
    clientSocket.on('connect', onConnection);

    clientSocket.on(ECHO, (data) => {
        clientSocket.emit(ECHO, data);
    });

    clientSocket.on("*", function (event, data) {
        socketLog.__log(event, "on", data);
    });

    onConnection();
});

try {
    server.listen(port);
    console.log(`Socket starting at ${port}`);
} catch (err) {
    console.log("err", err);
}

export default userIdToSocketMap;
