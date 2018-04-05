import UserDocumentsSchema from "../mongo-models/UserDocumentsSchema";

let createEducation = {

    async addDocument({document_type, document_no, document_files}, user) {
        let {_id: user_id, name, profile_pic_url} = user;

        return await new UserDocumentsSchema({
            user_id, name, profile_pic_url, document_no, document_type, document_files
        }).save(user);

    },

    async updateDocument(properties, {user, params}){
        let document_id = params.document_id;
        let userDoc = await UserDocumentsSchema.findOneOrFail(document_id);

        for (let key in properties) {
            userDoc[key] = properties[key];
        }
        await userDoc.save(user);
        return userDoc;
    },

    async getMyDocuments(user_id){
        return await UserDocumentsSchema.find({user_id});
    },

    async deleteDocument(_id){
        await UserDocumentsSchema.find({_id}).remove();
    }
};

export default createEducation;