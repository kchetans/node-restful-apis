import JobPostingSchema from "../../../mongo-models/JobPostingSchema";
import UserProfileSchema from "../../../mongo-models/UsersProfileSchema";
import JobApplicationDataManger from "../../../data-manager/JobApplicationDataManger";
import RecommendedJobs from "../../../mongo-models/RecommendedJobs";
import RecommendedUsers from "../../../mongo-models/RecommendedUsers";

let checkFullTimeAttributes = function (category = "", preferences = []) {
    return _.intersection([category], preferences).length;
};
let checkPartTimeAttributes = function (category = "", preferences = []) {
    return _.intersection([category], preferences).length;
};
let isCityMatched = function (jobCity = '', userCity = '') {
    return jobCity.toString().toLowerCase() === userCity.toString().toLowerCase()
};

let recommendation = {

    /**
     * @param user_id => new user's id
     */
    async saveRecommendedJobsForCandidatesAndCandidatesForJobs(user_id) {

        //check recommedation is made fot this user or not
        if (await RecommendedJobs.findOne({user_id}).lean())
            return;

        let {full_time_preferences, part_time_preferences, city} = await UserProfileSchema.findOne({_id: user_id}, {
            'full_time_preferences': 1,
            'city': 1,
            _id: 0
        }) || {};

        let allActiveJobIdsExcludingPostedByMySelf = _.map(await JobPostingSchema.find({
            is_active: true,
            employer_id: {$nin: [user_id]}
        }, '_id'), obj => obj._id);

        let appliedJobsId = await JobApplicationDataManger.getAllAppliedJobs(user_id, allActiveJobIdsExcludingPostedByMySelf);

        let notAppliedJobsId = _.difference(allActiveJobIdsExcludingPostedByMySelf, appliedJobsId);

        let recommendedJobs = await recommendation.getJobs(notAppliedJobsId, full_time_preferences, part_time_preferences, city, user_id);

        await new RecommendedJobs({
            user_id, jobs: recommendedJobs
        }).save();
    },

    async getJobs(notAppliedJobsId, full_time_preferences, part_time_preferences, city, user_id) {

        let notAppliedJobsPosted = await JobPostingSchema.find({_id: {$in: notAppliedJobsId}});

        return _.map(notAppliedJobsPosted, notAppliedJobPosted => {
            let {_id, category, city: jobCity} = notAppliedJobPosted;

            let ftp = checkFullTimeAttributes(category, full_time_preferences) * 1.0;
            let ptp = checkPartTimeAttributes(category, part_time_preferences) * 0.7;
            let isCitySame = isCityMatched(jobCity, city) ? 1 : 0.5;
            let rank = (ftp + ptp + isCitySame) / 3;

            /** Save job in this user's recommendation **/
            RecommendedUsers.findOne({job_id: _id}, (err, recommendedUserForJob) => {
                if (recommendedUserForJob) {
                    let newJob = {job: user_id, rank, user: user_id};
                    RecommendedUsers.update({job_id: _id}, {$push: {users: newJob}}, (e) => {
                        if (e)
                            console.log("e", e);
                    });
                }
            });

            return {
                job: _id,
                rank
            }
        })
    }
};

export default recommendation;
