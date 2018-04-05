/**
 * Created By Raghvendra Srivastava
 * on 14 June, 2017
 */

import UserProfileDataManager from "../../../data-manager/UserProfileDataManager";
import UsersProfileSchema from "../../../mongo-models/UsersProfileSchema";
import UsersExperienceSchema from "../../../mongo-models/UsersExperienceSchema";
import UsersEducationSchema from "../../../mongo-models/UsersEducationSchema";
import UserConnectionsSchema from "../../../mongo-models/UserConnectionsSchema";
import JobApplicationSchema from "../../../mongo-models/JobApplicationSchema";

import EmailUrlTokenSchema from "../../../mongo-models/EmailUrlTokenSchema";
import chatSocket from "../chats/chat-socket-method";
import config from "config";

import Utils from "../../../utils/utils";
import request from "request-promise";
import recommendation from "../jobs/recommendation-users";
import {CONFIRM_MAIL_URL} from "../../../constants/application";
import mail from "../../mail";
import chalk from "chalk";
let mapsApiKey = config.get("mapsApiKey");


let userLib = {

    async checkAndSaveConnections(mobile_nos, mobile_no_one) {
        let notConnectionsList = mobile_nos;

        // Getting mobile nos which exist in workex user collection
        let connectionsList = await UserProfileDataManager.find({mobile_no: {$in: mobile_nos}}, ['mobile_no']);

        if (connectionsList && connectionsList.length > 0) {
            let connectionMobileNos = _.map(connectionsList, listItem => listItem.mobile_no);

            // Getting mobile nos which doesn't exist in workex user collection
            notConnectionsList = _.difference(mobile_nos, connectionMobileNos);
            await Promise.all(_.map(connectionsList, connection => {
                let {mobile_no: mobile_no_two} = connection;
                UserConnectionsSchema.findOne({
                    mobile_no_one: mobile_no_two,
                    mobile_no_two: mobile_no_one
                }).then((connectionDoc) => {
                    if (connectionDoc) { // Connection exists.
                        connectionDoc.is_connected = true;
                        connectionDoc.save();
                    } else { // connection doesn't exist previously. Insert a new connection.
                        new UserConnectionsSchema({mobile_no_two, mobile_no_one, is_connected: true}).save();
                    }

                }, (err) => {
                    console.log("Error occurred while fetching from UserConnection Collection.");
                });
            }));
        }

        let newArray = _.map(notConnectionsList, mobile_no_two => {
            return Object.assign({},
                {mobile_no_two, mobile_no_one})
        });

        await UserConnectionsSchema.insertMany(newArray);
    },

    async getContacts(mobile_nos, mobile_no_one) {

        let contactsList = {};

        let [contactsOne, contactsTwo] = await Promise.all([
            UserConnectionsSchema.find({
                mobile_no_two: mobile_no_one,
                is_connected: true
            }, {'mobile_no_one': 1, 'is_connected': 1, _id: 0}),
            UserConnectionsSchema.find({
                mobile_no_one: mobile_no_one
            }, {'mobile_no_two': 1, 'is_connected': 1, _id: 0})
        ]);

        _.map(contactsOne, contact => {
            if (_.includes(mobile_nos, contact.mobile_no_one)) {
                let {mobile_no_one, is_connected} = contact;
                contactsList[mobile_no_one] = is_connected;
            }
        });

        _.map(contactsTwo, contact => {
            if (_.includes(mobile_nos, contact.mobile_no_two)) {
                let {mobile_no_two, is_connected} = contact;
                contactsList[mobile_no_two] = is_connected;
            }
        });

        return contactsList;
    },

    async updateProfile(user, object){
        let properties = ["name", "current_location", "mobile_no", "email", "gender", "dob", "about", "designation", "company_type", "company_name", "web_site_url",
            "profile_pic_url", "cover_pic_url", "status", "education", "languages", "total_experience", "full_time_preferences", "part_time_preferences", "city", "location"];
        let objectToSave = _.pick(object, properties);

        let isEmailChanged = user.email !== objectToSave.email;
        let isNameChanged = user.name !== objectToSave.name;

        if (user)
            for (let key in objectToSave) {
                user[key] = objectToSave[key];
            }
        if (isEmailChanged)
            user.is_email_verified = false;

        await user.save();

        // update user info in other collections also
        if (objectToSave && objectToSave.profile_pic_url) {
            userLib.updateUserProfilePicture(user, objectToSave.profile_pic_url);
        }

        if (objectToSave && objectToSave.name) {
            userLib.updateUserName(user, objectToSave.name);
        }

        if (objectToSave && objectToSave.city && !objectToSave.location) {
            userLib.getLocationAndStore(user._id, objectToSave.city);
        }

        JobApplicationSchema.update({user_id: user._id}, {$set: {user_profile: user}}, {multi: true}).exec();

        await UsersProfileSchema.updatePercentage(user._id);

        if (isNameChanged && user.name) {
            recommendation.saveRecommendedJobsForCandidatesAndCandidatesForJobs(user._id);
            chatSocket.sendNotificationOnSocket(user._id, {
                title: "Welcome to WorkEx - India's Only Work Life Platform",
                body: ""
            });
        }

        let sendEmailVerifymail = false;
        if (sendEmailVerifymail && isEmailChanged && objectToSave && objectToSave.email) {
            // generate verification token to authenticate user while resetting the password
            let verificationToken = Utils.uid(60);
            let expirationTime = moment().add(24, "hours");

            // generate confirm email url
            let siteUrl = config.get('url');
            let resetUrl = siteUrl + CONFIRM_MAIL_URL + Utils.encodeBase64URLsafe(verificationToken);

            // store the token in database
            await EmailUrlTokenSchema({
                "token": verificationToken,
                "expirationTime": expirationTime,
                "user": user._id
            }).save();

            // send mail to verify email
            mail.sendConfirmEmailMail({
                link_url: resetUrl,
                user_name: user.name,
                to_mail: user.email,
                valid_time: "24 Hours"
            });
        }

        return user;
    },

    updateUserProfilePicture(user, profile_pic_url){
        userLib.updateUserAttribute(user, 'profile_pic_url', profile_pic_url);
    },

    async updateUserName(user, name){
        userLib.updateUserAttribute(user, 'name', name);
    },

    async updateUserAttribute(user, key, value){
        /* update profile_pic_url to user and experience schema asynchronously */
        UsersExperienceSchema.update({user_id: user._id}, {$set: {[key]: value}}, {multi: true}).exec();
        UsersEducationSchema.update({user_id: user._id}, {$set: {[key]: value}}, {multi: true}).exec();


        //todo
        // UserProfileViews.update({"view_by.user_id": user._id}, {$set: {["view_by." + key]: value}}).exec();
        // UserReviews.update({user_id: user._id}, {$set: {[key]: value}}).exec();
        // UserAskedReviews.update({user_id: user._id}, {$set: {[key]: value}}).exec();
        // UserDocumentsSchema.update({user_id: user._id}, {$set: {[key]: value}}).exec();
        // UserDocumentsSchema.update({user_id: user._id}, {$set: {[key]: value}}).exec();
        // UserConnectionsSchema.update({user_id: user._id}, {$set: {[key]: value}}).exec();
    },

    async __saveLocationForUser(user_id, location){
        await UsersProfileSchema.update({_id: user_id}, {$set: {location}});
    },

    getLocationAndStore(user_id, city){
        let uri = `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${mapsApiKey}`;
        request({
            uri,
            json: true
        }).then(response => {
            let {status, results} = response;
            switch (status) {
                case "OK":
                    /** indicates that no errors occurred; the address was successfully parsed and at least one geocode was returned.*/
                    if (results && results[0]) {
                        let location = results[0].geometry.location;
                        userLib.__saveLocationForUser(user_id, location);
                    }
                    break;
                case "ZERO_RESULTS":
                    /**  indicates that the geocode was successful but returned no results. This may occur if the geocoder was passed a non-existent address. **/
                    break;
                case "OVER_QUERY_LIMIT":
                    /** indicates that you are over your quota. */
                    console.log(chalk.red("!!!!*******************Google MAP api OVER_QUERY_LIMIT*******************!!!!"));
                    break;
                case "REQUEST_DENIED":
                    break;
                case "INVALID_REQUEST":
                    break;
                case "UNKNOWN_ERROR":
                    /**  indicates that the request could not be processed due to a server error. The request may succeed if you try again.*/
                    setTimeout(() => userLib.getLocationAndStore(user_id, city), 5000);
                    break;
            }
        }).catch(err => {
            console.log("err", err);
        });
    },

    async createNewPendingAction(toSaveUser, {job_id, user_id}){
        let userProfile = await UsersProfileSchema.findOne({_id: toSaveUser});
        if (!userProfile.pending_actions)
            userProfile.pending_actions = [];
        userProfile.pending_actions.push({job_id, user_id});
        userProfile = await userProfile.save();
        return userProfile.pending_actions[userProfile.pending_actions.length - 1]._id
    },

    async getPendingActionId(current_user_id, {job_id, user_id}){
        let userProfile = await UsersProfileSchema.findOneOrFail({_id: current_user_id}, "User doesn't exist");
        let {pending_actions} = userProfile;

        console.log("pending_actions", pending_actions);
        console.log("job_id", job_id);
        console.log("user_id", user_id);

        let pending_action_id = undefined;
        _.forEach(pending_actions, pending_action => {
            let {job_id: ljob_id, _id, user_id: luser_id} = pending_action;

            console.log(" typeof ljob_id ", typeof ljob_id);
            ljob_id = typeof ljob_id !== 'string' ? ljob_id.toHexString() : ljob_id;
            luser_id = typeof luser_id !== 'string' ? luser_id.toHexString() : luser_id;
            job_id = typeof job_id !== 'string' ? job_id.toHexString() : job_id;
            user_id = typeof user_id !== 'string' ? user_id.toHexString() : user_id;

            if (ljob_id === job_id && luser_id === user_id) {
                pending_action_id = _id;
                console.log("in if");
                return false;
            } else {
                console.log("in else");
            }
        });
        console.log("pending_action_id", pending_action_id);
        if (pending_action_id)
            return pending_action_id.toHexString();

        console.log(chalk.red("pending_action_id  not found"));

        return undefined;
    },

    async removeFromPendingAction(user_id, pending_action_id){
        let userProfile = await UsersProfileSchema.findOne({_id: user_id});
        if (userProfile.pending_actions) {
            let index = _.findIndex(userProfile.pending_actions, pendingAction => pendingAction._id == pending_action_id);
            userProfile.pending_actions.splice(index, 1);
        }
        userProfile = await userProfile.save();
    }

};

export default userLib;