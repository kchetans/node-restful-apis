import * as speakeasy from "speakeasy";
import * as _ from "lodash";

let OTP_VALIDATION_TIME = 60 * 5; // in seconds
let OTP_ENCODING        = 'base32'; // in seconds


export const getUserName = function (userFullName) {
    return _.snakeCase(userFullName);
};

export const getNewOTP = function () {
    // base 32 encoded user secret key
    let secret = speakeasy.generateSecret({length: 20});
    // otp code
    let code   = speakeasy.totp({
        secret  : secret.base32,
        encoding: OTP_ENCODING,
        step    : OTP_VALIDATION_TIME
    });
    return {secret: secret.base32, code};
};


export const validateOtp = function (code, secret) {
    let status = speakeasy.totp.verify({
        secret  : secret,
        encoding: OTP_ENCODING,
        token   : code,
        step    : OTP_VALIDATION_TIME
    });
    return status;
};
