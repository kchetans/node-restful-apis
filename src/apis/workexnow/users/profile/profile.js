/**
 * Created By KARTIK AGARWAL
 * on 8 June, 2017
 */
import UsersExperienceSchema from "../../../../mongo-models/UsersExperienceSchema";
import UserProfileDataManager from "../../../../data-manager/UserProfileDataManager";
import UserProfileViewsDataManager from "../../../../data-manager/UserProfileViewsDataManager";
import UsersUiManager from "../../../../ui-manager/users";
import userLib from "../user-lib";

let createJob = {

    async getProfile(object, options){
        let {user} = options;
        let {user_id} = options.params;

        let data = await UserProfileDataManager.getProfile(user_id, 'public');

        UserProfileViewsDataManager.makeProfileView({by_user: user, of_user: user_id});

        return {
            data: data,
            message: "Profile fetched Successfully"
        }

    },

    async getMyProfile(object, options){
        let {user} = options;
        let data = await UserProfileDataManager.getMyProfile(user);
        return {
            data,
            message: "Profile fetched successfully"
        }
    },

    async updateProfile(object, options){
        let {user} = options;
        let {full_profile = false} = options.query;
        let userProfile = await userLib.updateProfile(user, object, options);
        let data = {};
        if (full_profile) {
            return await createJob.getMyProfile(object, options);
        } else {
            data = UsersUiManager.getMyProfile(userProfile.toJSON());
        }
        return {
            data,
            message: "Profile updated successfully"
        }
    },

    async addExperience(object, options){
        let {user} = options;
        let {_id,} = user;
        let properties = ["designation", "company", "duration", "doj", "dol"];

        let newSaveObject = _.pick(object, properties);
        newSaveObject.name = user.name;
        newSaveObject.profile_pic_url = user.profile_pic_url;
        newSaveObject.user_id = user._id;
        let userExp = await new UsersExperienceSchema(newSaveObject).save(user);
        return {
            data: userExp,
            message: "Experience added successfully",
            info: "user /profile/experience instead"
        }
    },
};

export default createJob;