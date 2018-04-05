import UserReviewsSchema from "../mongo-models/UserReviews";

let createEducation = {

    async getMyReviews(user_id){
        return await UserReviewsSchema.find({
            user_id,
            is_public: true, is_deleted: false
        }).lean();
    },

    async getMyAllReviews(user_id){
        return [];
    },

    async getMyPublicReviews(user_id){
        return [];
    },

    async makeReviewPublic(user_id){
        return [];
    },

    async makeReviewPrivate(user_id){
        return [];
    },

    async askForReview(user_id){
        return [];
    },

    async writeReviewInDb(object){
        let {
            association, text, author_profile_pic_url,
            author_designation, author_name, author_id,
            profile_pic_url, name, user_id
        } = object;

        new UserReviewsSchema({
            association, text, author_profile_pic_url,
            author_designation, author_name, author_id,
            profile_pic_url, name, user_id
        }).save();
    }

};

export default createEducation;