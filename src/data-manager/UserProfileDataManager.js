import UserProfileSchema from "../mongo-models/UsersProfileSchema";
import UsersUiManager from "../ui-manager/users";
import UserEducationDataManager from "./UserEducation";
import UserDocumentsDataManager from "./UserDocuments";
import UserExperienceDataManager from "./UserExperience";
import UserSkillAndCertificationDataManager from "./UserSkillAndCertification";
import UserProfileViewsDataManager from "./UserProfileViewsDataManager";
import UserReviewsDataManager from "./UserReviews";
import * as errors from "../errors";
import chalk from "chalk";
import {ROLES, USER_COVER_PICS} from "../constants/application";
import WxMath from "../utils/WxMaths";
let redis = require("../redis-module");

let MY_PROFILE_URL_PROJECTION = ["mobile_no", "name", "email", "gender", "dob", "profile_pic_url",
    "education", "languages", "city", "location", "views", "share", "total_experience", "full_time_preferences",
    "part_time_preferences", "connections", "about", "designation", "company_name", "company_logo_url", "current_location",
    "company_type", "web_site_url", "profile_percentage", "cover_pic_url", "status"];

let UserProfile = {

    async update(...params){
        UserProfileSchema.update(...params).exec();
        UserProfileSchema.updatePercentage(params[0]._id);
    },

    async updateProfilePercentage(user_id){
        return await UserProfileSchema.updatePercentage(user_id);
    },

    async findOneOrFail(...params){
        return await UserProfileSchema.findOneOrFail(...params);
    },

    async find(...params){
        return await UserProfileSchema.find(...params);
    },

    async getProfilePercentage(user_id){
        let profile_percentage = await UserProfileSchema.findOne({_id: user_id}, ["profile_percentage"]);
        return profile_percentage ? profile_percentage.profile_percentage || 0 : 0;
    },

    async findOrFail(...params){
        return await UserProfileSchema.findOrFail(...params);
    },

    async findOne(...params){
        return await UserProfileSchema.findOne(...params);
    },

    async getOnlyProfile(_id){
        return UserProfileSchema.findOne({_id}).lean()
    },

    async canPostJobOrFail(employer){
        let {name, is_mobile_verified} = employer;
        let canPostJob = name && is_mobile_verified;
        if (!canPostJob)
            throw new errors.ValidationError({
                code: "INCOMPLETE_PROFILE",
                message: "Update your name, \n Please Update Your Profile to Continue to Posting a Job."
            });
    },

    async canApplyOnJobOrFail(employee){
        if (!UserProfile.canApplyOnJob(employee)) {
            throw new errors.ValidationError({
                code: "INCOMPLETE_PROFILE",
                message: "Enter Name, then only you can apply on Jobs."
            });
        }
    },


    canApplyOnJob(employee){
        let {name = false, is_mobile_verified = false} = employee;
        return (name && is_mobile_verified);
    },


    async getMyProfile(user, projection = MY_PROFILE_URL_PROJECTION){
        let {_id} = user;
        return await UserProfile.getProfile(_id, 'private', projection);
    },

    async getProfile(_id, view_type, projection = MY_PROFILE_URL_PROJECTION){
        let [profile, reviews, skill_and_certifications, experiences, educations, documents, viewCount] = [];

        switch (view_type) {
            case  'private':
                [profile, reviews, skill_and_certifications, experiences, educations, documents, viewCount] =
                    await Promise.all([
                        UserProfileSchema.findOne({_id}, projection).lean(),
                        UserReviewsDataManager.getMyReviews(_id),
                        UserSkillAndCertificationDataManager.getAllSkill(_id),
                        UserExperienceDataManager.getAllExperience(_id),
                        UserEducationDataManager.getAllEducation(_id),
                        UserDocumentsDataManager.getMyDocuments(_id),
                        UserProfileViewsDataManager.getViewCount(_id)
                    ]);
                break;
            case  'public':
                projection = _.difference(projection, ["mobile_no", "email"]);
                [profile, reviews, skill_and_certifications, experiences, educations, viewCount] =
                    await Promise.all([
                        UserProfileSchema.findOne({_id}, projection).lean(),
                        UserReviewsDataManager.getMyReviews(_id),
                        UserSkillAndCertificationDataManager.getAllSkill(_id),
                        UserExperienceDataManager.getAllExperience(_id),
                        UserEducationDataManager.getAllEducation(_id),
                        UserProfileViewsDataManager.getViewCount(_id)
                    ]);
                break;
            case  'job_application':
                [profile, reviews, skill_and_certifications, experiences, educations, documents, viewCount] =
                    await Promise.all([
                        UserProfileSchema.findOne({_id}, projection).lean(),
                        UserReviewsDataManager.getMyReviews(_id),
                        UserSkillAndCertificationDataManager.getAllSkill(_id),
                        UserExperienceDataManager.getAllExperience(_id),
                        UserEducationDataManager.getAllEducation(_id),
                        UserDocumentsDataManager.getMyDocuments(_id),
                        UserProfileViewsDataManager.getViewCount(_id)
                    ]);
                break;
            default :
                console.log(chalk.red("invalid view type", view_type));
                return {};
        }

        if (!profile) profile = {};
        profile = UsersUiManager.getMyProfile(profile, viewCount);
        profile.reviews = reviews.length;
        experiences = _.map(experiences, experience => UsersUiManager.getExperience(experience));
        educations = _.map(educations, education => UsersUiManager.getEducation(education));
        skill_and_certifications = _.map(skill_and_certifications, education => UsersUiManager.getSkillCertification(education));

        return {
            profile, reviews, skill_and_certifications, experiences, educations, documents
        }
    },

    async addBookmarksJob(_id, job_id){
        return await UserProfileSchema.update({_id, bookmarks: {$nin: [job_id]}}, {$push: {bookmarks: job_id}});
    },

    async removeBookmarkJob(_id, job_id){
        await await UserProfileSchema.update({_id, bookmarks: {$in: [job_id]}}, {$pull: {bookmarks: job_id}});
    },

    async getPeople(q, attributes, {pageSize = 15, pageNo = 0}){
        pageSize = parseInt(pageSize);
        pageNo = parseInt(pageNo);
        if (!q)
            return await UserProfileSchema.find({roles: ROLES.EMPLOYEE, name: {$exists: true}}, attributes)
                .skip(pageSize * pageNo)
                .limit(pageSize)
                .lean();
        return await UserProfileSchema.find({
            roles: ROLES.EMPLOYEE,
            $or: [
                {name: {$regex: new RegExp(q, "i")}},
                {mobile_no: {$regex: new RegExp(q, "i")}},
                {status: {$regex: new RegExp(q, "i")}},
                {city: {$regex: new RegExp(q, "i")}},
                {full_time_preferences: {$regex: new RegExp(q, "i")}},
            ]
        }, attributes)
            .skip(pageSize * pageNo)
            .limit(pageSize)
            .lean();
    },

    async createNewUser(object){
        object.cover_pic_url = USER_COVER_PICS.both[_.random(0, USER_COVER_PICS.both.length)];
        let user = await new UserProfileSchema(object).save();
        UserProfileViewsDataManager.createViewEntry(user);
        return user;
    },

    async addRole(user, role){
        let currentRoles = user.roles;
        if (!_.includes(currentRoles, role)) {
            // user.roles.push(role);
            user.roles = role;
            await user.save();
        }
        return user;
    },

    async checkAndAddName(user, name){
        if (user.name) {
            user.name = name;
            await user.save();
        }
        return user;
    },

    async checkAndAddEmail(user, email){
        if (user.email) {
            user.email = email;
            await user.save();
        }
        return user;
    },

    async checkAndAddProfilePic(user, profile_pic_url){
        if (user.profile_pic_url) {
            user.profile_pic_url = profile_pic_url;
            await user.save();
        }
        return user;
    },

    async updateLastSeen(_id){
        //update in mongoose
        let last_seen = new Date();
        await UserProfileSchema.update({_id}, {last_seen});
    },

    async getUser(_id){
        let user = undefined;
        user = await redis.redisClient.getAsync(`user:${_id}`);
        if (!user) {
            user = await UserProfileSchema.findOne({_id});
            redis.redisClient.set(`user:${_id}`, user);
        }
        return user;
    },

    async getUserName(_id){
        let user = await UserProfileSchema.findOne({_id}, 'name');
        return user.name;
    },

    async getUserSubscriberId(_id){
        let user = await UserProfileSchema.findOne({_id}, 'subscriber_id');
        return user.subscriber_id;
    },

    async computeLatLon(user){
        let {locations: data} = user;

        console.log("data", data);

        let latMean = WxMath.mean(data.map(item => item.lat));
        let latSd = WxMath.standardDeviation(data.map(item => item.lat));

        let lonMean = WxMath.mean(data.map(item => item.lon));
        let lonSd = WxMath.standardDeviation(data.map(item => item.lon));

        let latOutLiers = WxMath.outliers(data.map(item => item.lat), latMean, latSd);
        let lonOutLiers = WxMath.outliers(data.map(item => item.lon), lonMean, lonSd);

        let reqPositions = [];
        data.map((item, index) => {
            if (latOutLiers[index] && lonOutLiers[index]) {
                reqPositions.push(item);
            }
        });

        let lat = WxMath.mean(reqPositions.map(reqPosition => reqPosition.lat));
        let lon = WxMath.mean(reqPositions.map(reqPosition => reqPosition.lon));

        user.location = {lat, lon};
        user.outlierFilterLocations = reqPositions;

        await user.save();
    }
};

export default UserProfile;