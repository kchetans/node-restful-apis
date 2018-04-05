import UsersEducationSchema from "../mongo-models/UsersEducationSchema";

let createEducation = {

    async addEducation({institute, course, start_date, end_date , is_currently_pursuing}, user) {
        let {_id: user_id, name, profile_pic_url} = user;
        let dataToInsert = {
            user_id, name, profile_pic_url, institute,is_currently_pursuing,
            course, start_date, end_date
        };
        return await new UsersEducationSchema(dataToInsert).save(user);
    },

    async getAllEducation(user_id) {
        return await UsersEducationSchema.find({user_id}, null, {sort: {start_date: -1}}).lean() || [];
    },

    async getEducation(education_id) {
        return await UsersEducationSchema.findOrFail(education_id);
    },

    async updateEducation(object, user, education_id) {
        let educationItem = await UsersEducationSchema.findOrFail(education_id);
        for (let key in object)
            educationItem[key] = object[key];
        await educationItem.save(user);
        return educationItem;
    },

    async removeEducation(education_id) {
        return await UsersEducationSchema.remove({_id: education_id});
    }

};

export default createEducation;