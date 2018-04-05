import JobPostingSchema from "../../../mongo-models/JobPostingSchema";
import JobApplicationDataManager from "../../../data-manager/JobApplicationDataManger";
import UserProfileDataManager from "../../../data-manager/UserProfileDataManager";
import UsersProfileSchema from "../../../mongo-models/UsersProfileSchema";
import RecommendedUsers from "../../../mongo-models/RecommendedUsers";
import RecommendedJobs from "../../../mongo-models/RecommendedJobs";
import {ROLES} from "../../../constants/application";


let checkFullTimeAttributes = function (category = "", preferences = []) {
    return _.intersection([category], preferences).length;
};
let checkPartTimeAttributes = function (category = "", preferences = []) {
    return _.intersection([category], preferences).length;
};
let checkBothTimeAttributes = function (category = "", preferences = [], preferences2 = []) {
    return _.intersection([category], preferences.concat(preferences2)).length;
};
let isCityMatched = function (jobCity = '', userCity = '') {
    return jobCity.toString().toLowerCase() === userCity.toString().toLowerCase()
};

let recommendation = {

    /**
     * @param job_id => new job id
     */
    async saveRecommendedCandidatesForJobAndJobForCandidates(job_id){
        let {category, city, employer_id} = await JobPostingSchema.findOne({_id: job_id}) || {};

        let allEmployeesIdsOtherThanMySelf = _.map(await UserProfileDataManager.find({
            roles: ROLES.EMPLOYEE,
            name: {$exists: true, $ne: null},
            _id: {$nin: [employer_id]}
        }, "_id"), obj => obj._id);

        let appliedEmployeesId = await JobApplicationDataManager.getAllUserJobsBlabla(job_id, allEmployeesIdsOtherThanMySelf);
        let notAppliedEmployeesId = _.difference(allEmployeesIdsOtherThanMySelf, appliedEmployeesId);
        let recommendedUsers = await recommendation.getCandidates(notAppliedEmployeesId, job_id, category, city);
        await new RecommendedUsers({
            job_id, users: recommendedUsers
        }).save();

    },


    async getCandidates(notAppliedEmployeesId, job_id, category, city){

        let notAppliedUsersProfile = await UsersProfileSchema.find({_id: {$in: notAppliedEmployeesId}});

        return _.map(notAppliedUsersProfile, notAppliedUserProfile => {
            let {_id: user_id, part_time_preferences, full_time_preferences, city: userCity} = notAppliedUserProfile;

            let ftp = checkFullTimeAttributes(category, part_time_preferences) * 1.0;
            let ptp = checkPartTimeAttributes(category, full_time_preferences) * 0.7;
            let btp = checkBothTimeAttributes(category, part_time_preferences, full_time_preferences) * 0.5;
            let isCityMacthed = isCityMatched(city, userCity) ? 1 : 0.5;
            let rank = (ftp + ptp + btp + isCityMacthed ) / 4;


            /** update job in this user's recommendation **/
            RecommendedJobs.findOne({user_id}, (err, recommendedJobForUser) => {
                if (err) {
                    console.log("err", err);
                }
                else if (recommendedJobForUser) {
                    if (!recommendedJobForUser.jobs)
                        recommendedJobForUser.jobs = [];
                    recommendedJobForUser.jobs = recommendedJobForUser.jobs.concat({
                        job: job_id,
                        rank: rank + 0.02
                    });
                    recommendedJobForUser.save((e) => {
                        if (e)
                            console.log("err", e);
                    });
                } else {
                    //user not exist, create new record,
                    // this case will not happen,  but written for old user migration
                    new RecommendedJobs({
                        user_id,
                        jobs: {
                            job: job_id,
                            rank
                        }
                    }).save((e) => {
                        if (e)
                            console.log("err", e);
                    });
                }
            });

            return {
                user: user_id,
                rank
            }
        });
    },

};

export default recommendation