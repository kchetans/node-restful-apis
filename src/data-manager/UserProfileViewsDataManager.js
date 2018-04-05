import UserProfileViewsSchema from "../mongo-models/UserProfileViews";

let OtpDataManager = {

    async makeProfileView({by_user, of_user: user_id}){
        let {nModified} = await UserProfileViewsSchema.update({user_id}, {
            $push: {
                view_by: {
                    user_id: by_user._id,
                    name: by_user.name,
                    profile_pic_url: by_user.profile_pic_url,
                }
            }
        });
        if (!nModified) {
            return await new UserProfileViewsSchema({
                user_id, view_by: [{
                    user_id: by_user._id,
                    name: by_user.name,
                    profile_pic_url: by_user.profile_pic_url,
                }]
            }).save();
        }
    },


    async createViewEntry(user){
        let {_id: user_id, name, profile_pic_url} = user;
        return await new UserProfileViewsSchema({user_id}).save();
    },

    async getViewCount(user_id){
        let a = await UserProfileViewsSchema.findOne({user_id});
        let b = a && a.view_by && a.view_by.length > 0 ? a.view_by.length : 0;
        return b;
    },
};

export default OtpDataManager;