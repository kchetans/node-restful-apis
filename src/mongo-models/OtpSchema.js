import mongoose, {Schema} from "mongoose";
import sms_service from "sms_service";
import baseModel from "./base";
import config from "config";
import format from "string-template";

import * as errors from "../errors";
import {INVALID_OTP_MSG, MAX_RETRY_REACHED_OTP_MSG} from "../constants/application";
let staticOtp = config.get("static_otp") || false;

const OtpSchema = new Schema({

    mobile_no: {
        type: String,
        required: [true, 'User phone number required'],
        unique: true,
        validate: {
            validator: mobile_no => {
                return /\d{10}/.test(mobile_no)
            },
            message: '{VALUE} Invalid Mobile No.'
        }
    },

    otp: {
        type: Number,
        required: true
    },

    retry_count: {
        type: Number,
        required: true
    },

    expireAt: {
        type: Date
    }
});

OtpSchema.plugin(baseModel, {});

OtpSchema.statics.MAX_RETRY_COUNT = 5;
OtpSchema.statics.VALIDATITY = 15; // 15 mins
OtpSchema.statics.MAX_RETRY_AFTER_TIME = 2 * 60; // 2 hours
OtpSchema.statics.SEND_OLD_OTP = true;

OtpSchema.statics.sendAndSaveOtp = async function (mobile_no, isNewUser) {
    /* Generates 6 digit random otp between 1000 and 9999 */
    let newOtp = staticOtp || Math.floor(Math.random() * 9000) + 1000;
    /* await bcoz max retry can be there */
    /* also returns old otp */
    let oldOtp = await this.saveOtp(newOtp, mobile_no);
    let otpToSend = this.SEND_OLD_OTP ? oldOtp : newOtp;
    sms_service.sendOtp(mobile_no, otpToSend, isNewUser);
};

/**
 * Save OTP for mobile no, and also takes care for retry count,
 * when retry, old otp will be returned
 * @param otp
 * @param mobile_no
 */
OtpSchema.statics.saveOtp = async function (otp, mobile_no) {
    let otpRecord = await this.findOne({mobile_no});
    let newOtp = otp;
    /* if record found */
    if (otpRecord) {
        let oldOtp = otpRecord.otp;
        /* if max re-try reached throw error */
        if (otpRecord.retry_count > this.MAX_RETRY_COUNT) {
            let expireTime = moment(otpRecord.expireAt).add(1, 'm');
            let duration = moment.duration(moment().diff(expireTime));
            let timeToDisplay = Math.ceil(duration.asMinutes());
            timeToDisplay = moment.duration(timeToDisplay, "minutes").humanize();

            throw new errors.ValidationError({message: format(MAX_RETRY_REACHED_OTP_MSG, {timeToDisplay})});

        } else if (otpRecord.retry_count === this.MAX_RETRY_COUNT) {
            let otpToSave = this.SEND_OLD_OTP ? oldOtp : newOtp;
            this.update({mobile_no}, {
                $set: {
                    retry_count: ++otpRecord.retry_count, otp: otpToSave,
                    expireAt: moment().add(this.MAX_RETRY_AFTER_TIME, 'm')
                }
            }).exec();
        } else {
            let otpToSave = this.SEND_OLD_OTP ? oldOtp : newOtp;
            /* increase retry and updated new otp then save*/
            this.update({mobile_no}, {
                $set: {
                    retry_count: ++otpRecord.retry_count, otp: otpToSave,
                    expireAt: moment().add(this.VALIDATITY, 'm')
                }
            }).exec();
        }
        return oldOtp;
    }
    else {
        await new this({otp, mobile_no, retry_count: 1, expireAt: moment().add(this.VALIDATITY, 'm')}).save();
        return otp;
    }
};

OtpSchema.statics.verifyOtp = async function (otp, mobile_no) {
    let otpRecord = await this.findOne({mobile_no});
    if (otpRecord) {
        if (otpRecord.otp == otp) {
            this.remove({mobile_no}).exec();
            return true;
        } else {
            throw new errors.ValidationError({message: INVALID_OTP_MSG});
        }
    } else {
        throw new errors.ValidationError({message: "No OTP record found for this no. " + mobile_no});
    }
};

OtpSchema.index({"expireAt": 1}, {expireAfterSeconds: 0});

const OtpModel = mongoose.model('otp_record', OtpSchema);

// expose the access model
module.exports = OtpModel;

