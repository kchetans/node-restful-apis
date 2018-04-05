import UsersSkillsAndCertificationsSchema from "../mongo-models/UsersSkillsAndCertificationsSchema";

let createEducation = {

    async addSkill({institute, course, start_date, end_date}, user) {
        let {_id: user_id, name, profile_pic_url} = user;
        let dataToInsert = {
            user_id, name, profile_pic_url, institute,
            course, start_date, end_date
        };
        return await new UsersSkillsAndCertificationsSchema(dataToInsert).save(user);
    },

    async getAllSkill(user_id) {
        return await UsersSkillsAndCertificationsSchema.find({user_id}).lean() || [];
    },

    async getSkill(education_id) {
        return await UsersSkillsAndCertificationsSchema.findOrFail(education_id);
    },

    async updateSkill(object, user, education_id) {
        let educationItem = await UsersSkillsAndCertificationsSchema.findOrFail(education_id);
        for (let key in object)
            educationItem[key] = object[key];
        await educationItem.save(user);
        return educationItem;
    },

    async removeSkill(education_id) {
        return await UsersSkillsAndCertificationsSchema.remove({_id: education_id});
    }

};

export default createEducation;