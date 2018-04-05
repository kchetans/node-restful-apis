import JobPostingSchema from "../../mongo-models/JobPostingSchema";
import UserProfileDataManager from "../../data-manager/UserProfileDataManager";

let searchAPi = {

    async search(object, options){

        let {pageSize = 15, pageNo = 0, q = ''} = options.query;


        let jobs = await JobPostingSchema.find({
            $or: [
                {title: {$regex: new RegExp(q, "i")}},
                {company_name: {$regex: new RegExp(q, "i")}},
                {description: {$regex: new RegExp(q, "i")}},
                {category: {$regex: new RegExp(q, "i")}},
                {type: {$regex: new RegExp(q, "i")}}
            ]
        })
            .skip(pageSize * pageNo)
            .limit(pageSize)
            .sort({created_at: -1})
            .lean();

        return {
            data: {
                jobs,
                meta: {}
            },
            message: ""
        }
    },

    async appOpen(object, options){
        let {user} = options;
        let profile_percentage = await UserProfileDataManager.getProfilePercentage(user._id);
        let notification_count = 0;
        let new_message_count = 0;

        return {
            data: {
                user: {
                    profile_percentage
                },
                stats: {
                    notification_count,
                    new_message_count
                }
            },
            message: "fetched successfully"
        }
    },
};

export default searchAPi;