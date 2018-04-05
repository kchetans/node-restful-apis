/**
 * Created by anand on 14/09/15.
 * File to hold value of constants to be used in the whole application anywhere
 */
import path from "path";

// temporary folder path
export const TMP = path.resolve(path.join('content', 'tmp'));

// directory for public content
export const publicDir = path.resolve('public');

// directory for client website
export const clientDir = path.resolve(path.join('client', 'dist'));

// directory for static views
export const viewDir = path.resolve('views');

// india Time Zone
export const tzIndia = 'Asia/Calcutta';

// type of email services used in sending email
export const MAIL_SERVICE = {
    GMAIL: 'gmail',
    DIRECT: 'direct',
    MAILGUN: 'mailgun'
};

export const JOB_APPLICATION_STATE = {
    applied: "applied",
    interested: "interested",
    not_interested: "not_interested",
    matched: "matched",
    rejected: "rejected",
    hired: "hired",
    offer_letter_sent: "offer_letter_sent",
    closed: "closed",
    offer_letter_rejected: "offer_letter_rejected"
};

export const ROLES = {
    EMPLOYER: "employer",
    EMPLOYEE: "employee",
};

export const URLS = {
    profile_pic: "https://s3.ap-south-1.amazonaws.com/workex.test1/95714c47-a2c9-48c9-8b32-0c5a01454eb7.png"
};

export const JOB_CATEGORY_IMAGES = require('./job-categories-images.json');
export const JOB_CATEGORY_RANDOM_IMAGES = require('./job-categories-images-random.json');

export const USER_COVER_PICS = require('./user-cover-pics.json');

export const PAGE_SIZE = 15;
export const PAGE_NO = 0;


export const NAME_MAX_LENGTH = 25;
export const STATUS_MAX_LENGTH = 60;
export const ABOUT_ME_MAX_LENGTH = 100;


export const JOB_DESCRIPTION_MIN_LENGTH = 50;
export const JOB_DESCRIPTION_MAX_LENGTH = 1000;

export const WEB_FRONT_END_URL = "workex.in";
export const APP_DEEPLINK_URL = "jobs.workex.in";


export const CONFIRM_MAIL_URL = "api/workexnow/v1/users/confirm-email/";
export const REQUEST_REVIEW_URL = "pub/review/";
export const DEFAULT_EMAIL_FROM = "noreply@mg.workex.in";

export const PLAY_STORE_APP_URL = "https://play.google.com/store/apps/details?id=com.whatsapp";


export const INVALID_OTP_MSG = "You've entered an incorrect OTP.\nPlease try again.";
export const MAX_RETRY_REACHED_OTP_MSG = "You have requested the OTP 5 times.\n" +
    "For your security, you are temporarily blocked from requesting new OTP. Please try again in {timeToDisplay}.";