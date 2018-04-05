/**
 * Created By KARTIK AGARWAL
 * on 8 June, 2017
 */

import * as errors from "../../../errors";

import OtpDataManager from "../../../data-manager/Otp";
import UserProfileDataManager from "../../../data-manager/UserProfileDataManager";
import EmailUrlTokenSchema from "../../../mongo-models/EmailUrlTokenSchema";
import UsersProfileSchema from "../../../mongo-models/UsersProfileSchema";
import UserLocationSchema from "../../../mongo-models/UserLocationSchema";
import Utils from "../../../utils/utils";
import * as jwtUtils from "../../../utils/json-web-token";
import {INVALID_OTP_MSG} from "../../../constants/application";
import {INVALID_ROLE, INVALID_TOKEN, INVALID_USER, ROLE_REQUIRED} from "../../../constants/error_codes";
import {CANT_SWITCH_ROLES_EMPLOYEE, CANT_SWITCH_ROLES_EMPLOYER} from "../../../constants/notification-messages";
let createJob = {

    async sendOtp(object, options){
        let {mobile_no, roles} = object;

        if (!mobile_no || !roles)
            throw new errors.ValidationError({
                code: ROLE_REQUIRED,
                message: "mobile_no and roles is required"
            });

        let user = await UserProfileDataManager.findOne({mobile_no});

        let isNewUser = false;
        if (!user) {
            isNewUser = true;
        } else {
            if (user.roles === "") {
                user.roles = roles;
                await user.save();
            }
            else if (user.roles !== roles) {
                let message = user.roles === 'employer' ? CANT_SWITCH_ROLES_EMPLOYER : CANT_SWITCH_ROLES_EMPLOYEE;
                throw new errors.ValidationError({
                    code: INVALID_ROLE,
                    message
                })
            }
        }

        /**
         * await bcoz, it can reach max retry
         */
        await OtpDataManager.sendAndSaveOtp(mobile_no, isNewUser);

        return {
            data: {is_new_user: isNewUser},
            message: `OTP send to no ${mobile_no}`
        }
    },

    async confirmOtp(object, options){
        let {otp, roles, mobile_no, name} = object;

        if (!otp)
            throw new errors.ValidationError({message: "Enter OTP"});
        if (!mobile_no)
            throw new errors.ValidationError({message: "mobile_no are required"});

        let isOtpVerified = await OtpDataManager.verifyOtp(otp, mobile_no);

        if (!isOtpVerified)
            throw errors.ValidationError({message: INVALID_OTP_MSG});

        let user = await UserProfileDataManager.findOne({mobile_no});

        if (user && user.roles !== roles) {
            let message = user.roles === 'employer' ? CANT_SWITCH_ROLES_EMPLOYER : CANT_SWITCH_ROLES_EMPLOYEE;
            throw new errors.ValidationError({
                code: INVALID_ROLE,
                message
            })
        }

        /**Create new user on confirm otp **/
        if (!user)
            user = await UserProfileDataManager.createNewUser({
                mobile_no, roles, is_mobile_verified: true, name, login_source: "OTP"
            });
        // else
        //     user = await  UserProfileDataManager.addRole(user, roles); // add role in case of login via new role

        let [token, userProfile] = await Promise.all([
            jwtUtils.generateLoginToken(user),
            UserProfileDataManager.findOne({user_id: user._id})
        ]);

        /**filter user info send over network **/
        user = _.pick(user, ["_id", "mobile_no", "email", "name", "profile_pic_url", "roles", "app_language", "is_mobile_verified"]);
        userProfile = _.pick(userProfile, ["name", "email", "gender", "dob", "aadhar_no", "profile_pic_url", "education", "languages", "location", "views", "share",
            "total_experience", "full_time_preferences", "part_time_preferences",
            "city"]);

        //login_timestamp is required for updating profile on ionic app
        return {
            data: {
                user: Object.assign({}, userProfile, user, {user_id: user._id}, {login_timestamp: new Date()}),
                token
            },
            message: "otp verified",
        }
    },

    async updateSubscriberId(object, options){
        let {subscriber_id} = object;
        let {user} = options;

        if (!subscriber_id)
            throw new errors.ValidationError({message: "subscriber_id is required"});

        user.subscriber_id = subscriber_id;
        await user.save();

        return {
            message: "subscriber_id is added successfully"
        }
    },

    async updateLocation(object, options){
        let {user} = options;

        if (!object)
            throw new errors.ValidationError({message: "body is required"});

        if (object)
            object.lon = object.lng;
        await new UserLocationSchema({user_id: user._id, locations: object}).save();

        if (user.locations.length > 10) {
            user.locations.splice(0, 1);
        }
        user.locations.push(object);
        await user.save();

        UserProfileDataManager.computeLatLon(user);

        return {
            message: "location added successfully"
        }
    },

    async confirmEmail(object, options){
        let {token: verifyToken} = options.params;
        let tokenInfo = await EmailUrlTokenSchema.validateToken(verifyToken);

        let userInfo = await UsersProfileSchema.findOne({_id: tokenInfo.user});
        userInfo.is_email_verified = true;
        // mark the user verified
        await userInfo.save();

        // send welcome mail
        // todo : send mail
        // await mail.sendWelcomeMail(userInfo);

        return {
            message: "Mail confirmed"
        }
    },

    async signWithSim(object, options){
        let {mobile_no, roles, ...meta} = object;

        if (!mobile_no)
            throw new errors.ValidationError({message: "mobile_no are required"});

        let user = await UserProfileDataManager.findOne({mobile_no});

        if (user && user.roles !== roles) {
            let message = user.roles === 'employer' ? CANT_SWITCH_ROLES_EMPLOYER : CANT_SWITCH_ROLES_EMPLOYEE;
            throw new errors.ValidationError({
                code: INVALID_ROLE,
                message
            })
        }

        /**Create new user on confirm otp **/
        if (!user)
            user = await UserProfileDataManager.createNewUser({
                mobile_no, roles,
                login_source: "SIM",
                is_mobile_verified: true,
                sim_info: meta
            });


        let [token, userProfile] = await Promise.all([
            jwtUtils.generateLoginToken(user),
            UserProfileDataManager.findOne({user_id: user._id})
        ]);

        /**filter user info send over network **/
        user = _.pick(user, ["_id", "mobile_no", "email", "name", "profile_pic_url", "roles", "app_language", "is_mobile_verified"]);
        userProfile = _.pick(userProfile, ["name", "email", "gender", "dob", "aadhar_no", "profile_pic_url", "education", "languages", "location", "views", "share",
            "total_experience", "full_time_preferences", "part_time_preferences",
            "city"]);

        //login_timestamp is required for updating profile on ionic app
        return {
            data: {
                user: Object.assign({}, userProfile, user, {user_id: user._id}, {login_timestamp: new Date()}),
                token
            },
            message: "otp verified",
        }
    },

    async signWithFb(object, options){
        let {name, email, profile_pic_url, fb_id, mobile_no, roles, ...meta} = object;

        mobile_no = Utils.timedMobileNo(mobile_no);

        let user = await UserProfileDataManager.findOne({$or: [{mobile_no}, {fb_id}]});

        /**Create new user on confirm otp **/
        if (!user)
            user = await UserProfileDataManager.createNewUser({
                mobile_no, name, email, roles,
                is_mobile_verified: true,
                login_source: "FACEBOOK",
                fb_id: fb_id, fb_info: meta
            });
        else {
            UserProfileDataManager.checkAndAddName(user, name);
            UserProfileDataManager.checkAndAddEmail(user, email);
            UserProfileDataManager.checkAndAddProfilePic(user, profile_pic_url);
            user = await UserProfileDataManager.addRole(user, roles);
        } // add role in case of login via new role

        let [token, userProfile] = await Promise.all([
            jwtUtils.generateLoginToken(user),
            UserProfileDataManager.findOne({user_id: user._id})
        ]);

        /**filter user info send over network **/
        user = _.pick(user, ["_id", "mobile_no", "email", "name", "profile_pic_url", "roles", "app_language", "is_mobile_verified"]);
        userProfile = _.pick(userProfile, ["name", "email", "gender", "dob", "aadhar_no", "profile_pic_url", "education", "languages", "location", "views", "share",
            "total_experience", "full_time_preferences", "part_time_preferences",
            "city"]);

        //login_timestamp is required for updating profile on ionic app
        return {
            data: {
                user: Object.assign({}, userProfile, user, {user_id: user._id}, {login_timestamp: new Date()}),
                token
            },
            message: "otp verified",
        }
    },

    async signWithOldToken(object, options){
        let {token: inCommingtoken, mobile_no, roles} = object;

        let user = await UserProfileDataManager.findOne({mobile_no});

        if (!user) {
            throw new errors.ValidationError({
                code: INVALID_USER,
                message: 'Invalid User'
            })
        }

        if (user.roles === "") {
            user.roles = roles;
            await user.save();
        }

        // first send invalid role
        if (user.roles !== roles) {
            let message = user.roles === 'employer' ? CANT_SWITCH_ROLES_EMPLOYER : CANT_SWITCH_ROLES_EMPLOYEE;
            throw new errors.ValidationError({
                code: INVALID_ROLE,
                message
            })
        }
        else if (user.auth_token !== inCommingtoken)
            throw new errors.ValidationError({
                code: INVALID_TOKEN,
                message: INVALID_TOKEN
            });


        let [token, userProfile] = await Promise.all([
            jwtUtils.generateLoginToken(user),
            UserProfileDataManager.findOne({user_id: user._id})
        ]);

        /**filter user info send over network **/
        user = _.pick(user, ["_id", "mobile_no", "email", "name", "profile_pic_url", "roles", "app_language", "is_mobile_verified"]);
        userProfile = _.pick(userProfile, ["name", "email", "gender", "dob", "aadhar_no", "profile_pic_url", "education", "languages", "location", "views", "share",
            "total_experience", "full_time_preferences", "part_time_preferences",
            "city"]);

        //login_timestamp is required for updating profile on ionic app
        return {
            data: {
                user: Object.assign({}, userProfile, user, {user_id: user._id}, {login_timestamp: new Date()}),
                token
            },
            message: "otp verified",
        }
    },

};

export default createJob;
