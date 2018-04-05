import JobPostingSchema from "../mongo-models/JobPostingSchema";
import UsersProfileSchema from "../mongo-models/UsersProfileSchema";
import UsersExperienceSchema from "../mongo-models/UsersExperienceSchema";
import UserProfileDataManager from "../data-manager/UserProfileDataManager";


let checkFullTimeAttributes = function (category = [], preferences = []) {
    return _.intersection(category, preferences).length;
};
let checkPartTimeAttributes = function (category = [], preferences = []) {
    return _.intersection(category, preferences).length;
};
let checkBothTimeAttributes = function (category = [], preferences = [], preferences2 = []) {
    return _.intersection(category, preferences.concat(preferences2)).length;
};
let isCityMatched = function (jobCity, userCity) {
    return jobCity.toLowerCase().equals(userCity.toLowerCase());
};
let getDaysJobPostedBefore = function (postedDate) {
    postedDate = moment(postedDate);
    return postedDate.diff(moment(), 'days');
};

let getActiveJobs = async function () {
    return await JobPostingSchema.find({
        is_active: true
    }, '_id category type min_qualification location city views min_salary max_salary no_of_open_vacancies no_of_close_vacancies language gender')
};


let init = async function (user_id) {
    let [user, userProfile, userExperience] = await Promise.all([
        UserProfileDataManager.findOne({_id: user_id}),
        UsersProfileSchema.findOne({_id: user_id}),
        UsersExperienceSchema.findOne({user_id: user_id}),
    ]);

    let activeJobs = await getActiveJobs();
    _.map(activeJobs, activeJob => {
        //TODO exclude jobs he applied on, deleted
        let fta = checkFullTimeAttributes(activeJob.category, userProfile.full_time_preferences);
        let pta = checkPartTimeAttributes(activeJob.category, userProfile.part_time_preferences);
        let bta = checkBothTimeAttributes(activeJob.category, userProfile.full_time_preferences, userProfile.part_time_preferences);
        let isCityMatched = isCityMatched(activeJob.city, "");
        let daysJobPostedBefore = getDaysJobPostedBefore(activeJob.createdAt);
        let noOfPositionsLeft = activeJob.no_of_open_vacancies - activeJob.no_of_close_vacancies;

    });
};


init("user_id");

