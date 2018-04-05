import UserReviews from "../../../../mongo-models/UserReviews";
import UserAskedReviews from "../../../../mongo-models/UserAskedReviews";
import EmailUrlTokenSchema from "../../../../mongo-models/EmailUrlTokenSchema";
import UsersProfileSchema from "../../../../mongo-models/UsersProfileSchema";
import UserReviewsDataManager from "../../../../data-manager/UserReviews";
import sms_service from "sms_service/index";
import * as Utils from "../../../../utils/utils";
import mail from "../../../mail";
import PushNotification from "../../../../push-notification/atsNotification";
import config from "config";
import {REQUEST_REVIEW_URL} from "../../../../constants/application";
let errors = require('../../../../errors');


let reviewAPIS = {

    async askForReview(object, options) {
        let {user} = options;
        let {email, name, mobile_no, message} = object;

        let asked_to_user_id = await UsersProfileSchema.findOne({mobile_no}, '_id subscriber_id');

        // generate verification token to authenticate user while clicking on mail link
        let verificationToken = Utils.uid(60);
        let expirationTime = moment().add(24 * 30, "hours");

        // generate confirm email url
        let siteUrl = config.get('url');
        let reviewUrl = siteUrl + REQUEST_REVIEW_URL + Utils.encodeBase64URLsafe(verificationToken);

        // store the token in database
        await EmailUrlTokenSchema({
            "token": verificationToken,
            "expirationTime": expirationTime,
            "user": user._id
        }).save();

        let userReview = await new UserAskedReviews({
            asked_from_user_id: user._id,
            asked_to_user_id: asked_to_user_id,
            name, email, mobile_no, message,
            token: verificationToken, review_given: false
        }).save();


        // send mail to verify email
        if (email)
            mail.sendRequestReviewMail({
                contact_name: name,
                review_request_link: reviewUrl,
                user_name: user.name,
                link_url: reviewUrl,
                to_mail: email,
            });

        if (asked_to_user_id)
            PushNotification.sendRequestReviewPush(asked_to_user_id, {name: user.name});
        sms_service.sendRequestReview(mobile_no, name, user.name, message, reviewUrl, userReview._id);

        return {
            message: "message done"
        };
    },

    async removeReview(object, options){
        let {review_id} = options.params || {};
        let review = await  await UserReviews.find({_id: review_id});
        review.is_deleted = false;
        await  review.save();

        return {
            message: "Review removed Successfully"
        }
    },

    async removePublic(object, options){
        let reviewId = options.params.id;

        let review = await UserReviews.findOne({_id: reviewId});
        review.is_public = false;
        await review.save();

        return {
            message: "Review Made private Successfully"
        };
    },

    async submitReview(object, options){
        let {association, text, user_id} = object || {};
        let {user} = options;
        let review_about_user = await UsersProfileSchema.findOneOrFail(user_id);
        let {name, profile_pic_url} = review_about_user;

        let {
            profile_pic_url: author_profile_pic_url,
            designation: author_designation,
            name: author_name,
            _id: author_id
        } = user;

        let saveObject = {
            association, text,
            author_profile_pic_url,
            author_designation, author_name, author_id,
            profile_pic_url, name, user_id
        };

        PushNotification.sendRequestWrittenPush(review_about_user, {name: author_name});
        await UserReviewsDataManager.writeReviewInDb(saveObject);

        return {
            data: saveObject,
            message: "Review Posted Successfully"
        };
    },

    async submitReviewFromWeb(object, options){
        let {association, text, token} = object || {};
        let reviewAdskedInfo = await UserAskedReviews.findOne({token: token});

        if(reviewAdskedInfo.review_given){
            throw new errors.ValidationError({message : ""});
        }
        let {
            asked_from_user_id, asked_to_user_id,
            name: author_name, email, mobile_no, message
        } = reviewAdskedInfo;
        let review_about_user = await UsersProfileSchema.findOneOrFail(asked_from_user_id);
        let {name, profile_pic_url} = review_about_user;

        let {
            author_profile_pic_url, author_designation, author_id
        } = {};

        if (asked_to_user_id) {
            let review_by_user = await UsersProfileSchema.findOne(asked_to_user_id);
            if (review_by_user) {
                author_profile_pic_url = review_by_user.profile_pic_url;
                author_designation = review_by_user.designation;
                author_name = review_by_user.name;
                author_id = review_by_user._id;
            }
        } else {
            author_name = reviewAdskedInfo.name;
        }

        let saveObject = {
            association, text,
            author_profile_pic_url,
            author_designation, author_name, author_id,
            profile_pic_url, name, user_id: asked_from_user_id
        };

        PushNotification.sendRequestWrittenPush(review_about_user, {name: author_name});
        await UserReviewsDataManager.writeReviewInDb(saveObject);
        UserAskedReviews.update({token: token}, {$set: {review_given: true}}).exec();
        return {
            message: "Review Posted Successfully"
        };
    },

    async getReviewInfoFromToken(object, options){
        let {token: verifyToken} = options.params;
        let tokenInfo = await EmailUrlTokenSchema.validateToken(verifyToken);
        let reviewAdskedInfo = await UserAskedReviews.findOne({token: tokenInfo.token});

        return {
            data: reviewAdskedInfo,
            message: "Mail confirmed"
        }
    }

};

export default reviewAPIS;