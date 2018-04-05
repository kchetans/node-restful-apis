/**
 * Created By Raghvendra Srivastava
 * on 12 June, 2017
 */
import UserLib from "./user-lib";
import UserConnectionsSchema from "../../../mongo-models/UserConnectionsSchema";
import UserProfileSchema from "../../../mongo-models/UsersProfileSchema";
import * as errors from "../../../errors";
import sms_service from "sms_service";

let insertContacts = {

    async addContacts(object, options) {
        let {mobile_nos} = object;
        let {user} = options;
        let {mobile_no : mobile_no_one} = user || {};

        if (!mobile_nos || !Array.isArray(mobile_nos))
            throw new errors.ValidationError({message: "mobile_nos is required and must be array"});

        let isAlreadyAvailable = await UserConnectionsSchema.find({
            mobile_no_one,
            mobile_no_two: {$in: mobile_nos}
        });

        /**
         * save contacts if no connections found
         */
        if (isAlreadyAvailable && isAlreadyAvailable.length === 0) {
            await UserLib.checkAndSaveConnections(mobile_nos, mobile_no_one);
        }

        /**
         * fetch contacts with is connected or not
         */
        let connectionList = await UserLib.getContacts(mobile_nos, mobile_no_one);

        if (!(isAlreadyAvailable && isAlreadyAvailable.length))
            await UserProfileSchema.update({user_id: user._id}, {$inc: {connections: Object.keys(connectionList).length}});

        return {            data: {
                connectionList
            },
            message: "Contacts added successfully"
        }
    },

    async getConnectionCount(object, options) {
        let {user} = options;
        let {mobile_no} = user;

        let connectionCount = await UserConnectionsSchema.count({
            $or: [{mobile_no_one: mobile_no}, {mobile_no_two: mobile_no}],
            is_connected: true
        });

        return {
                data: {
                    connection: connectionCount
                },
                message: 'Count fetched successfully'
            }
    },

    async sendInviteToContact(object, options) {
        let {user, params} = options;
        let {mobile_no} = params;

        if (!mobile_no || mobile_no === 'undefined')
            throw new errors.ValidationError({message: 'Mobile No is required'});

        sms_service.sendInvite(mobile_no, user.name);

        return {
            message: "Invite sent successfully"
        }

    }
};

export default insertContacts;