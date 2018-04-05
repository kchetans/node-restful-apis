/**
 * Created By KARTIK AGARWAL
 * on 8 June, 2017
 */
import UserProfileDataManager from "../../../data-manager/UserProfileDataManager";
import UserUiManager from "../../../ui-manager/users";
import {URLS} from "../../../constants/application";
import atsNotification from "../../../push-notification/atsNotification";
let createJob = {

    async getUserShortProfile(object, options){
        let {user_id} = options.params;
        let userProfile = await UserProfileDataManager.findOrFail({_id: user_id});
        userProfile = _.pick(userProfile, ["name", "_id", "profile_pic_url"]);

        userProfile = UserUiManager.getShortProfile(userProfile);
        return {
            data: userProfile,
            message: "User profile fetched successfully"
        }
    },

    async sendPush(object, options){
        let {title = "title", body = "body"} = object;
        let {user} = options;
        atsNotification.sendTextPush(user.subscriber_id, {title, body});
        return {
            message: "User profile fetched successfully"
        }
    },


};

export default createJob;