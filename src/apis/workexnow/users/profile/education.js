/**
 *  Created by Raghvendra Srivastava
 *  on 23 June, 2017
 */
import * as errors from "../../../../errors";
import UserEducationDataManager from "../../../../data-manager/UserEducation";
import UserUiManager from "../../../../ui-manager/users";

let createEducation = {

    async addEducation(object, options) {
        let {user} = options;
        let {_id: user_id, name, profile_pic_url} = user;
        let {institute, course, start_date, end_date, is_currently_pursuing} = _.pick(object, ["is_currently_pursuing", "institute", "course", "start_date", "end_date"]);

        if (!institute)
            throw new errors.ValidationError({message: "institute is required"});
        if (!course)
            throw new errors.ValidationError({message: "course is required"});

        let dataToInsert = {
            user_id, name, profile_pic_url, institute, course, start_date, end_date, is_currently_pursuing
        };

        let education = await UserEducationDataManager.addEducation(dataToInsert, user);

        education = UserUiManager.getEducation(education);
        return {
            data: education,
            message: "Education added successfully"
        }
    },

    async getAllEducation(object, options) {
        let {user} = options;
        let {_id: user_id} = user;

        let educations = await UserEducationDataManager.getAllEducation(user_id) || [];

        educations = _.map(educations, education => {
            return Object.assign({}, education, {education_id: education._id});
        });

        return {
            data: educations,
            message: "All Educations fetched successfully"
        }
    },

    async getEducation(object, options) {
        let {params} = options;
        let {education_id: _id} = params;

        let education = await UserEducationDataManager.getEducation(_id);

        return {
            data: education,
            message: "Education fetched successfully"
        }
    },

    async updateEducation(object, options) {
        let {user, params} = options;
        let {education_id} = params;

        let educationItem = await  UserEducationDataManager.updateEducation(object, user, education_id);


        educationItem = UserUiManager.getEducation(educationItem);

        return {
            data: educationItem,
            message: "Education updated successfully"
        }
    },

    async removeEducation(object, options) {
        let {params} = options;
        let {education_id: _id} = params;

        await UserEducationDataManager.removeEducation(_id);
        return {
            message: `Education_id ${_id} successfully removed`
        };
    }

};

export default createEducation;