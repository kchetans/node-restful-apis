/**
 *  Created by Raghvendra Srivastava
 *  on 23 June, 2017
 */
import * as errors from "../../../../errors";
import UserSkillAndCertification from "../../../../data-manager/UserSkillAndCertification";
import UsersUiManager from "../../../../ui-manager/users";

let createEducation = {

    async addSkillAndCertification(object, options) {
        let {user} = options;
        let {_id: user_id, name, profile_pic_url} = user;
        let {institute, course, start_date, end_date} = _.pick(object, ["institute", "course", "start_date", "end_date"]);

        if (!institute)
            throw new errors.ValidationError({message: "institute is required"});
        if (!course)
            throw new errors.ValidationError({message: "course is required"});

        let dataToInsert = {
            user_id, name, profile_pic_url, institute, course, start_date, end_date
        };

        let skill_and_certifications = await UserSkillAndCertification.addSkill(dataToInsert, user);

        skill_and_certifications = UsersUiManager.getSkillCertification(skill_and_certifications);

        return {
            data: skill_and_certifications,
            message: "SkillAndCertification added successfully"
        }
    },

    async getAllSkillAndCertification(object, options) {
        let {user} = options;
        let {_id: user_id} = user;

        let educations = await UserSkillAndCertification.getAllSkillAndCertification(user_id) || [];

        educations = _.map(educations, education => {
            return Object.assign({}, education, {education_id: education._id});
        });

        return {
            data: educations,
            message: "All SkillAndCertification fetched successfully"
        }
    },

    async getSkillAndCertification(object, options) {
        let {params} = options;
        let {skill_certification_id: _id} = params;

        let education = await UserSkillAndCertification.getSkill(_id);

        return {
            data: education,
            message: "SkillAndCertification fetched successfully"
        }
    },

    async updateSkillAndCertification(object, options) {
        let {user, params} = options;
        let {skill_certification_id: education_id} = params;

        let educationItem = await  UserSkillAndCertification.updateSkill(object, user, education_id);

        educationItem = UsersUiManager.getSkillCertification(educationItem);

        return {
            data: educationItem,
            message: "SkillAndCertification updated successfully"
        }
    },

    async removeSkillAndCertification(object, options) {
        let {params} = options;
        let {skill_certification_id: _id} = params;

        await UserSkillAndCertification.removeSkill(_id);
        return {
            message: `SkillAndCertification ${_id} successfully removed`
        };
    }

};

export default createEducation;