/**
 *  Created by Raghvendra Srivastava
 *  on 23 June, 2017
 */
import UsersExperienceSchema from "../../../../mongo-models/UsersExperienceSchema";
import UsersProfileSchema from "../../../../mongo-models/UsersProfileSchema";
import UsersUiManager from "../../../../ui-manager/users";

let createExperience = {

    async addExperience(object, options) {
        let {user} = options;
        let {_id: user_id, name, profile_pic_url} = user;
        let properties = ["designation", "company", "duration", "doj", "dol", "is_current_job"];
        let newSaveObject = _.pick(object, properties);
        newSaveObject.user_id = user_id;
        newSaveObject.name = name;
        newSaveObject.profile_pic_url = profile_pic_url;

        let userExperience = await new UsersExperienceSchema(newSaveObject).save(user);

        if (newSaveObject.is_current_job) {
            newSaveObject.dol = undefined;
            //update current job in user profile
            UsersProfileSchema.updateCurrentJob(user_id, {
                company_name: newSaveObject.company,
                designation: newSaveObject.designation
            })
        }
        if (newSaveObject.duration) {
            UsersProfileSchema.addToTotalExperience(user_id, newSaveObject.duration)
        }

        return {
            data: UsersUiManager.getExperience(userExperience),
            message: "Experience added successfully"
        }
    },

    async getAllExperience(object, options) {
        let {user} = options;
        let {_id: user_id} = user;

        let userExperiences = await UsersExperienceSchema.find({user_id}) || [];

        userExperiences = _.map(userExperiences, userExperience => {
            return Object.assign({}, userExperience, {experience_id: userExperience._id});
        });

        return {
            data: userExperiences,
            message: "All Experiences fetched successfully"
        }
    },

    async getExperience(object, options) {
        let {params} = options;
        let {experience_id: _id} = params;

        let userExperience = await UsersExperienceSchema.findOrFail(_id);

        return {
            data: {
                userExperience
            },
            message: "Experience fetched successfully"
        }
    },

    async updateExperience(object, options) {
        let {user, params} = options;
        let {experience_id: _id} = params;


        let experienceItem = await UsersExperienceSchema.findOrFail(_id);

        for (let key in object) {
            experienceItem[key] = object[key];
        }

        await experienceItem.save(user);

        if (object && object.is_current_job) {
            //update current job in user profile
            UsersProfileSchema.updateCurrentJob(user._id, {
                company_name: object.company,
                designation: object.designation
            })
        }
        //todo : update user total experience

        return {
            data: UsersUiManager.getExperience(experienceItem),
            message: "Experience updated successfully"
        }
    },

    async removeExperience(object, options) {
        let {params, user} = options;
        let {experience_id: _id} = params;

        await UsersExperienceSchema.remove({_id});

        return {
            message: `Experience_id ${_id} successfully removed`
        }
    }

};

export default createExperience;