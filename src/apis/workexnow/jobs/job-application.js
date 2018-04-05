/**
 * Created By KARTIK AGARWAL
 * on 9 June, 2017
 */
import UserProfileDataManager from "../../../data-manager/UserProfileDataManager";
import JobApplicationDataManager from "../../../data-manager/JobApplicationDataManger";
import JobsDataManager from "../../../data-manager/Jobs";
import RecommendedUsers from "../../../mongo-models/RecommendedUsers";
import RecommendedJobs from "../../../mongo-models/RecommendedJobs";
import SendPushNotification from "./send-ats-push";
import chatMethods from "../chats/chat-socket-method";
import userLib from "../users/user-lib";
import * as errors from "../../../errors";
import {JOB_APPLICATION_STATE, ROLES} from "../../../constants/application";
let error = require('../../../errors');

let JobApplicationApis = {

    /**
     * creates a new job application from employer side
     */
    async erInterested(object, options){
        let {user: employer, params} = options;
        let {job_id, user_id} = params;

        await JobsDataManager.checkEmployerIsApplyingOnHisJob(user_id, job_id);

        /** Check if application all ready exist or not **/
        let jobApplication = await JobApplicationDataManager.checkJobApplicationExist(job_id, user_id);

        if (jobApplication)
            throw new errors.ValidationError({message: `Job Application all ready exist with user_id ${employer._id} on job_id ${job_id}`});

        let employee = await UserProfileDataManager.findOrFail(user_id, `user with user_id ${user_id} not found`);
        let jobPosted = await JobsDataManager.findOrFail(job_id, `job with job_id ${job_id} not found`);
        let employeeProfile = await UserProfileDataManager.getOnlyProfile(user_id);

        let {profile_pic_url: user_profile_pic_url, name: user_name, email, mobile_no} = employee;

        let newApplication = await JobApplicationDataManager.createNewJobApplication({
            job_id, job_posting: jobPosted, user_id: user_id,
            user_profile: employeeProfile,
            state: JOB_APPLICATION_STATE.interested, source: ROLES.EMPLOYER,
            employer_id: employer._id,
            seen_by_employee: false,
            interested_timestamp: new Date(),
        }, employee);


        let pendingActionId = await userLib.createNewPendingAction(user_id, {job_id, user_id: employer._id});

        // add "interested" to state stack for time-line view
        JobApplicationDataManager.onStageChange(newApplication._id, JOB_APPLICATION_STATE.interested, employer._id, pendingActionId);
        //send message on push
        SendPushNotification.afterErInterested(user_id, employer.name, jobPosted.title);
        // send message on socket
        chatMethods.saveErInterestedCard(job_id, employer._id.toHexString(), user_id, pendingActionId);

        //remove from recommendation
        RecommendedUsers.update({job_id}, {$pull: {users: {user: user_id}}}).exec();
        RecommendedJobs.update({user_id}, {$pull: {jobs: {job: job_id}}}).exec();

        return {
            data: newApplication,
            message: "Shown interest successfully"
        }
    },

    /**
     * creates a new job application from employee side
     */
    async eeApply(object, options){
        let {user: employee, params} = options;
        let {job_id} = params;

        await JobsDataManager.checkEmployerIsApplyingOnHisJob(employee._id, job_id);

        /** Check User profile is completed to apply on job or not**/
        await UserProfileDataManager.canApplyOnJobOrFail(employee);

        /** Check if application all ready exist or not **/
        let jobApplication = await JobApplicationDataManager.checkJobApplicationExist(job_id, employee._id);

        if (jobApplication)
            throw new errors.ValidationError({message: `Job Application all ready exist with user_id ${employee._id} on job_id ${job_id}`});

        /* check if job_id exist or not */
        let jobPosted = await JobsDataManager.findOrFail(job_id);
        let employeeProfile = await UserProfileDataManager.getOnlyProfile(employee._id);

        let newApplication = await JobApplicationDataManager.createNewJobApplication({
            job_id, job_posting: jobPosted, user_id: employee._id,
            employer_id: jobPosted.employer_id,
            user_profile: employeeProfile,
            state: JOB_APPLICATION_STATE.applied, source: ROLES.EMPLOYEE,
            applied_timestamp: new Date(),
        }, employee);

        let pendingActionId = await userLib.createNewPendingAction(jobPosted.employer_id, {
            job_id,
            user_id: employee._id
        });

        JobApplicationDataManager.onStageChange(newApplication._id, JOB_APPLICATION_STATE.applied, employee._id, pendingActionId);

        SendPushNotification.afterEeApply(jobPosted.employer_id, employee.name, jobPosted.title);

        chatMethods.saveEeApplyCard(job_id, jobPosted.employer_id.toHexString(), employee._id.toHexString(), pendingActionId);

        RecommendedUsers.update({job_id}, {$pull: {users: {user: employee._id}}}).exec();
        RecommendedJobs.update({user_id: employee._id}, {$pull: {jobs: {job: job_id}}}).exec();

        return {
            message: "Applied successfully"
        }
    },

    async erShortList(object, options){
        let {user: employer, params} = options;
        let {job_id, user_id} = params;

        await JobsDataManager.checkEmployerIsApplyingOnHisJob(user_id, job_id);

        let pending_action_id;

        let jobPosted = await JobsDataManager.findOrFail(job_id, `job with ${job_id} does not exist`);
        /** Check if application all ready exist or not **/
        let jobApplication = await JobApplicationDataManager.checkJobApplicationExist(job_id, user_id);

        if (!jobApplication) {
            JobApplicationApis.erInterested(object, options);
        } else {
            pending_action_id = await userLib.getPendingActionId(employer._id, {job_id, user_id});

            // if (!pending_action_id) {
            //     throw  new errors.ValidationError({code: "invalid_action", message: "pending_action_id not found"});
            // }

            jobApplication.seen_by_employee = false;
            jobApplication.state = JOB_APPLICATION_STATE.matched;
            jobApplication.matched_timestamp = new Date();
            await jobApplication.save();

            userLib.removeFromPendingAction(employer._id, pending_action_id);

            JobApplicationDataManager.onStageChange(jobApplication._id, JOB_APPLICATION_STATE.matched, employer._id);
            SendPushNotification.afterErShortList(user_id, employer.name, jobPosted.title);
            chatMethods.saveErShortListCard(job_id, employer._id.toHexString(), user_id, pending_action_id);
        }


        return {
            data: '',
            message: "Shortlisted successfully"
        }
    },

    async eeNotInterested(object, options) {
        let {user: employee, params} = options;
        let {job_id} = params;

        await JobsDataManager.checkEmployerIsApplyingOnHisJob(employee._id, job_id);

        let jobPosted = await JobsDataManager.findOrFail(job_id);
        let pending_action_id = await  userLib.getPendingActionId(employee._id, {
            job_id,
            user_id: jobPosted.employer_id.toHexString()
        });

        // if (!pending_action_id) {
        //     throw  new errors.ValidationError({code: "invalid_action", message: "pending_action_id not found"});
        // }

        /** Check if application all ready exist or not **/
        let jobApplication = await JobApplicationDataManager.checkJobApplicationExist(job_id, employee._id);

        // Update job application
        jobApplication.seen_by_employee = true;
        jobApplication.state = JOB_APPLICATION_STATE.not_interested;
        jobApplication.not_interested_timestamp = new Date();
        await jobApplication.save();
        // add to state stack
        JobApplicationDataManager.onStageChange(jobApplication._id, JOB_APPLICATION_STATE.not_interested, employee._id);
        //send push
        SendPushNotification.afterEeNotInterested(jobPosted.employer_id, employee.name, jobPosted.title);
        //remove form pending actions
        userLib.removeFromPendingAction(employee._id, pending_action_id);
        //update chat card
        chatMethods.saveEeNotInterestedCard(job_id, jobPosted.created_by.toHexString(), employee._id.toHexString(), pending_action_id);

        return {
            data: '',
            message: "Not interested successfully"
        }
    },

    async eeInterested(object, options){
        let {user: employee, params} = options;
        let {job_id,} = params;

        await JobsDataManager.checkEmployerIsApplyingOnHisJob(employee._id, job_id);
        let jobPosted = await JobsDataManager.findOrFail(job_id, `job is not posted with job_id ${job_id} `);
        let pending_action_id = await  userLib.getPendingActionId(employee._id, {
            job_id,
            user_id: jobPosted.employer_id.toHexString()
        });


        // if (!pending_action_id) {
        //     throw  new errors.ValidationError({code: "invalid_action", message: "pending_action_id not found"});
        // }

        /** Check if application all ready exist or not **/
        let jobApplication = await JobApplicationDataManager.checkJobApplicationExist(job_id, employee._id);

        // Update job application
        jobApplication.seen_by_employee = true;
        jobApplication.state = JOB_APPLICATION_STATE.matched;
        jobApplication.matched_timestamp = new Date();
        await jobApplication.save();
        // add to state stack
        JobApplicationDataManager.onStageChange(jobApplication._id, JOB_APPLICATION_STATE.matched, employee._id);
        //send push
        SendPushNotification.afterEeInterested(jobPosted.employer_id, employee.name, jobPosted.title);
        //remove form pending actions
        userLib.removeFromPendingAction(employee._id, pending_action_id);
        //update chat card
        chatMethods.saveEeInterestedCard(job_id, jobPosted.created_by.toHexString(), employee._id.toHexString(), pending_action_id);

        return {
            data: '',
            message: "Interested successfully"
        }
    },

    async eeAcceptOfferLetter(object, options){
        let {user: employee, params} = options;
        let {job_id} = params;

        await JobsDataManager.checkEmployerIsApplyingOnHisJob(employee._id, job_id);

        let jobPost = await JobsDataManager.findOrFail(job_id);
        let pending_action_id = await userLib.getPendingActionId(employee._id, {
            job_id,
            user_id: jobPost.employer_id.toHexString()
        });


        // if (!pending_action_id) {
        //     throw  new errors.ValidationError({code: "invalid_action", message: "pending_action_id not found"});
        // }

        /** Check if application all ready exist or not **/
        let jobApplication = await JobApplicationDataManager.checkJobApplicationExist(job_id, employee._id);

        jobApplication.seen_by_employee = true;
        jobApplication.state = JOB_APPLICATION_STATE.hired;
        jobApplication.hired_timestamp = new Date();

        await jobApplication.save();

        userLib.removeFromPendingAction(employee._id, pending_action_id);
        JobApplicationDataManager.onStageChange(jobApplication._id, JOB_APPLICATION_STATE.hired, employee._id);
        SendPushNotification.afterEeAcceptOfferLetter(jobPost.employer_id, employee.name, jobPost.title);
        chatMethods.saveEeAcceptOl(job_id, jobPost.created_by.toHexString(), employee._id.toHexString(), pending_action_id);

        return {
            data: '',
            message: "offer letter accepted successfully"
        }
    },

    async eeRejectOfferLetter(object, options){
        let {user: employee, params} = options;
        let {job_id} = params;

        await JobsDataManager.checkEmployerIsApplyingOnHisJob(employee._id, job_id);

        let jobPost = await JobsDataManager.findOrFail(job_id);
        let pending_action_id = await userLib.getPendingActionId(employee._id, {
            job_id,
            user_id: jobPost.employer_id.toHexString()
        });


        // if (!pending_action_id) {
        //     throw  new errors.ValidationError({code: "invalid_action", message: "pending_action_id not found"});
        // }

        /** Check if application all ready exist or not **/
        let jobApplication = await JobApplicationDataManager.checkJobApplicationExist(job_id, employee._id);

        jobApplication.seen_by_employee = true;
        jobApplication.state = JOB_APPLICATION_STATE.offer_letter_rejected;
        jobApplication.hired_timestamp = new Date();

        await jobApplication.save();

        userLib.removeFromPendingAction(employee._id, pending_action_id);
        JobApplicationDataManager.onStageChange(jobApplication._id, JOB_APPLICATION_STATE.offer_letter_rejected, employee._id);
        SendPushNotification.afterEeRejectOfferLetter(jobPost.employer_id, employee.name, jobPost.title);
        chatMethods.saveEeRejectOl(job_id, jobPost.created_by.toHexString(), employee._id.toHexString(), pending_action_id);

        return {
            data: '',
            message: "offer letter accepted successfully"
        }
    },

    async erSendOfferLetter(object, options) {
        let {user: employer, params} = options;
        let {job_id, user_id} = params;
        let {offer_letter} = object;

        await JobsDataManager.checkEmployerIsApplyingOnHisJob(user_id, job_id);

        if (!offer_letter)
            throw  new error.ValidationError({message: "offer_letter is required"});

        let pending_action_id_er;
        let pending_action_id_ee;

        /* check if job_id exist or not */
        let jobPosted = await JobsDataManager.findOrFail(job_id);

        /** Check if application all ready exist or not **/
        let jobApplication = await JobApplicationDataManager.checkJobApplicationExist(job_id, user_id);

        if (!jobApplication) {
            // create job application
            let employeeProfile = await UserProfileDataManager.getOnlyProfile(user_id);
            jobApplication = await JobApplicationDataManager.createNewJobApplication({
                job_id, job_posting: jobPosted, user_id: user_id,
                user_profile: employeeProfile,
                state: JOB_APPLICATION_STATE.offer_letter_sent, source: ROLES.EMPLOYER,
                employer_id: employer._id,
                offer_letter: [offer_letter],
                seen_by_employee: false,
                matched_timestamp: new Date(),
            }, employer);

            //remove from recommendation
            RecommendedUsers.update({job_id}, {$pull: {users: {user: user_id}}}).exec();
            RecommendedJobs.update({user_id}, {$pull: {jobs: {job: job_id}}}).exec();

            let pendingActionId = await userLib.createNewPendingAction(user_id, {job_id, user_id: employer._id});
            // add "offer_letter_sent" to state stack for time-line view
            await JobApplicationDataManager.onStageChange(jobApplication._id, JOB_APPLICATION_STATE.offer_letter_sent, employer._id);
            //send push
            await  SendPushNotification.afterErSendOfferLetter(user_id, employer.name, jobApplication.job_posting.title);
            // send message on socket
            await chatMethods.saveErSendOl(job_id, employer._id.toHexString(), user_id, offer_letter, pendingActionId);


        } else {
            pending_action_id_er = await userLib.getPendingActionId(employer._id, {job_id, user_id});
            pending_action_id_ee = await userLib.getPendingActionId(user_id, {job_id, user_id: employer._id});

            //update job application
            // jobApplication.offer_letter = offer_letter;
            jobApplication.offer_letter.push(offer_letter);
            jobApplication.seen_by_employee = false;
            jobApplication.state = JOB_APPLICATION_STATE.offer_letter_sent;
            jobApplication.offer_letter_sent_timestamp = new Date();
            await jobApplication.save();

            let pendingActionId = await userLib.createNewPendingAction(user_id, {job_id, user_id: employer._id});
            // add "offer_letter_sent" to state stack for time-line view
            await JobApplicationDataManager.onStageChange(jobApplication._id, JOB_APPLICATION_STATE.offer_letter_sent, employer._id);
            //send push
            await  SendPushNotification.afterErSendOfferLetter(user_id, employer.name, jobApplication.job_posting.title);
            // send message on socket
            await chatMethods.saveErSendOl(job_id, employer._id.toHexString(), user_id, offer_letter, pendingActionId,
                pending_action_id_ee, pending_action_id_er);

            if (pending_action_id_ee)
                userLib.removeFromPendingAction(user_id, pending_action_id_ee);
            if (pending_action_id_er)
                userLib.removeFromPendingAction(employer._id, pending_action_id_er);
        }


        return {
            message: "offer letter sent successfully"
        }

    },

    async setSeenApplicationId(object, options){
        let {application_id} = options.params || {};

        let jobApplication = await JobApplicationDataManager.checkJobApplicationExistFromId(application_id);

        jobApplication.seen_by_employee = true;
        jobApplication.save();

        return {
            message: "Seen Successfully"
        }
    },

    async erReject(object, options){
        let {user: employer, params} = options;
        let {job_id, user_id,} = params;

        await JobsDataManager.checkEmployerIsApplyingOnHisJob(user_id, job_id);

        let pending_action_id_er = await userLib.getPendingActionId(employer._id, {job_id, user_id});
        let pending_action_id_ee = await userLib.getPendingActionId(user_id, {job_id, user_id: employer._id});

        /** Check if application all ready exist or not **/
        let jobApplication = await JobApplicationDataManager.checkJobApplicationExist(job_id, user_id);

        if (!jobApplication)
            throw new errors.ValidationError({message: `Job Application not exist with user_id ${user_id} on job_id ${job_id}`});

        let prevoiusState = jobApplication.state;

        jobApplication.state = JOB_APPLICATION_STATE.rejected;
        jobApplication.seen_by_employee = false;
        jobApplication.rejected_timestamp = new Date();
        await jobApplication.save();

        JobApplicationDataManager.onStageChange(jobApplication._id, JOB_APPLICATION_STATE.rejected, employer._id);
        SendPushNotification.afterErReject(user_id, employer.name, jobApplication.job_posting.title);

        chatMethods.saveErRejected({
            job_id, employer_id: employer._id.toHexString(),
            employee_id: user_id, pending_action_id_ee, pending_action_id_er,
        }, prevoiusState);


        userLib.removeFromPendingAction(user_id, pending_action_id_ee);
        userLib.removeFromPendingAction(employer._id, pending_action_id_er);

        return {
            message: "Job application rejected"
        }
    },

    async employeeSeenJobsTimeline(object, options){
        let {job_application_id} = options.params;
        let jobApplication = await JobApplicationDataManager.checkJobApplicationExistFromId(job_application_id);
        jobApplication.seen_by_employee = true;
        await jobApplication.save();
        return {
            message: "Job Application status stack Seen update"
        }
    }
};

export default JobApplicationApis;
