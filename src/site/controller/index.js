
import moment from "moment";

import UsersEducationSchema from "../../mongo-models/UsersEducationSchema";
import UsersProfileSchema from "../../mongo-models/UsersProfileSchema";
import UsersExperienceSchema from "../../mongo-models/UsersExperienceSchema";
import UserDocumentsSchema from "../../mongo-models/UserDocumentsSchema";
import UsersReviewsSchema from "../../mongo-models/UserReviews";
import UserProfileViews from "../../mongo-models/UserProfileViews";
import JobPostingSchema from "../../mongo-models/JobPostingSchema";
import UserAskedReviews from "../../mongo-models/UserAskedReviews";
import UsersSkillsAndCertificationsSchema from "../../mongo-models/UsersSkillsAndCertificationsSchema";
import config from "config";
let siteUrl = config.get("url");

const router = require('express').Router();
let path = require('path');

let shareView = {

    async jobDetail(req, res){
        let jobInfo = {};
        let job_id = req.params.id;

        jobInfo = await JobPostingSchema.findOne({_id: job_id}).lean();
        jobInfo.time = moment(jobInfo.created_at).fromNow();
        res.render(path.join(__dirname,'../views/jobmobile'), jobInfo);
    },


    async profileDetail(req, res){
        let userId = req.params.id;


        let [
            userReviews,
            userDocuments,
            userExperience,
            userEducation,
            userProfile,
            UserProfileView,
            UserSkills
        ] = await Promise.all([
            UsersReviewsSchema.find({user_id: userId}).lean(),
            UserDocumentsSchema.find({user_id: userId}).lean(),
            UsersExperienceSchema.find({user_id: userId}).lean(),
            UsersEducationSchema.find({user_id: userId}).lean(),
            UsersProfileSchema.findOne({_id: userId}).lean(),
            UserProfileViews.findOne({user_id: userId}).lean(),
            UsersSkillsAndCertificationsSchema.find({user_id:userId}).lean()
        ]);

        let profile = {
            userProfile,
            userExperience,
            userEducation,
            userDocuments,
            userReviews,
            UserProfileView,
            UserSkills
        };
        res.render(path.join(__dirname,'../views/profilemobile'), profile);
    },

    async submitReview(req, res){
        let reviewToken = req.params.id;

        let reviewQuery = UserAskedReviews.findOne({token : reviewToken}).lean()
        reviewQuery.select('asked_from_user_id  name email message review_given');

        reviewQuery.exec(function (err, review) {
            if(err){
                console.log("unable to find review against token");
            }

            let userQuery = UsersProfileSchema.findOne({_id: review.asked_from_user_id}).lean();
            userQuery.select('name profile_pic_url status');

            userQuery.exec(function(err, userInfo){
                if(err){
                    console.log('Unable to find user detail from given review token')
                }

                let info = Object.assign({}, review);
                info.askedUser = userInfo;
                info.siteUrl = siteUrl;

                console.log(info);

                res.render(path.join(__dirname, '../views/submitreview'), info);
            });
            
        });

    }
}

export default shareView;