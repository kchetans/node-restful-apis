/**
 * Created By KARTIK AGARWAL
 * on 8 June, 2017
 */
const userRoutes = require('express').Router();
import authApis from "./auth";
import review from "./profile/review";
import users from "./users";
import contacts from "./contacts";
import notifications from "./notifications";
import bookmarkJobs from "./bookmark-jobs";
import jobInteraction from "./job-interaction";
import api from "_includes/api";
import auth from "../../../middleware/auth";
import profileApis from "./profile/index";

// Require user for private endpoints
const authenticateUser = [
    auth.authenticate.authenticateUser
];

const authenticateEmployer = [
    auth.authenticate.authenticateEmployer
];

const authenticateEmployee = [
    auth.authenticate.authenticateEmployee
];

/**Send OTP to given mobile no*/
userRoutes.post('/send-otp', api.http(authApis.sendOtp));
/**confirm OTP send to given mobile no*/
userRoutes.post('/confirm-otp', api.http(authApis.confirmOtp));

userRoutes.post('/sign-in-with-sim', api.http(authApis.signWithSim));

userRoutes.post('/sign-in-with-fb', api.http(authApis.signWithFb));

userRoutes.post('/sign-in-with-token', api.http(authApis.signWithOldToken));

/**confirm Email */
userRoutes.get('/confirm-email/:token', api.http(authApis.confirmEmail));
userRoutes.get('/review-token/:token', api.http(review.getReviewInfoFromToken));
userRoutes.post('/write-review/', api.http(review.submitReviewFromWeb));

/** update subscriber id **/
userRoutes.put('/subscriber-id', authenticateUser, api.http(authApis.updateSubscriberId));
userRoutes.put('/location', authenticateUser, api.http(authApis.updateLocation));

/** add contacts to user contacts */
userRoutes.post('/contacts', authenticateUser, api.http(contacts.addContacts));
/** get connection numbers */
userRoutes.get('/connection-count', authenticateUser, api.http(contacts.getConnectionCount));
/** get notfications */
userRoutes.get('/notifications', authenticateUser, api.http(notifications.getNotifications));
/** set notifications as read */
userRoutes.put('/notifications', authenticateUser, api.http(notifications.setNotificationsAsSeen));
/** set bookmarks */
userRoutes.put('/bookmark/:job_id', authenticateUser, api.http(bookmarkJobs.addBookmarks));
/** unset bookmarks */
userRoutes.delete('/bookmark/:job_id', authenticateUser, api.http(bookmarkJobs.removeBookmarks));

/** user sends invite to contact*/
userRoutes.post('/invite/:mobile_no', authenticateUser, api.http(contacts.sendInviteToContact));


userRoutes.get('/feed-notification', authenticateUser, api.http(notifications.getFeedNotification));
userRoutes.post('/send-me-push', authenticateUser, api.http(users.sendPush));
userRoutes.use('/profile', authenticateUser, profileApis);

userRoutes.get('/:user_id/active-jobs/', authenticateUser, authenticateEmployer, api.http(jobInteraction.getActiveJobs));

userRoutes.get('/:user_id', api.http(users.getUserShortProfile));

export default userRoutes;
