let redis = require("../redis-module");
import mongoose from "mongoose";
import {JOB_APPLICATION_STATE, PAGE_NO, PAGE_SIZE} from "../constants/application";
import JobApplicationSchema from "../mongo-models/JobApplicationSchema";
import UsersProfileSchema from "../mongo-models/UsersProfileSchema";
import PushNotification from "../push-notification/atsNotification";
import RecomendedUsersDataManager from "./RecomendedUsers";

let jobApplications = {

    async checkJobApplicationExist(job_id, user_id){
        return await JobApplicationSchema.findOne({job_id, user_id});
    },

    async checkJobApplicationExistFromId(application_id){
        return await JobApplicationSchema.findOne({_id: application_id});
    },

    async findOneFrom(job_id, user_id){
        return await JobApplicationSchema.findOne({job_id, user_id});
    },

    async getAllAppliedJobs (user_id, allJobsId){
        return await  JobApplicationSchema.find({
            user_id,
            job_id: {$in: allJobsId}
        }, {"job_id": 1, "_id": 0});
    },

    async getAllUserJobsBlabla(job_id, allEmployeesId){
        return await JobApplicationSchema.find({
            job_id,
            user_id: {$in: allEmployeesId}
        }, {"user   _id": 1, "_id": 0});
    },

    async updateApplicantStatus(job_id, jobInfo) {

        let [userIds, updatedCount] = await Promise.all([
            JobApplicationSchema.find({job_id, state: {$ne: "hired"}}, ["user_id"]),
            JobApplicationSchema.updateMany({job_id, state: {$ne: "hired"}}, {
                $set: {state: "closed"},
                $push: {
                    state_stack: {
                        time: new Date(),
                        state: "closed",
                        comments: ""
                    }
                }
            })
        ]);

        let userIdList = _.map(userIds, item => item.user_id);

        let subscriberIds = await UsersProfileSchema.find({_id: {$in: userIdList}}, "subscriber_id");
        let subscriberIdList = _.map(subscriberIds, item => item.subscriber_id);
        PushNotification.sendJobCloseNotification(userIdList, subscriberIdList, `The ${jobInfo.title} is now closed. Find other jobs on WorkEx`);

        return userIdList;
    },

    /**
     * @param job_application_id
     * @param state
     * @param user_id
     */
    async onStageChange(job_application_id, state, user_id, pending_action_id) {
        return await  JobApplicationSchema.update({_id: job_application_id}, {
            $push: {
                state_stack: {
                    time: new Date(),
                    state,
                    pending_action_id,
                    comments: "",
                    action_by: user_id
                }
            }
        });
    },

    async createNewJobApplication(object, creater){
        return await new JobApplicationSchema(object).save(creater);
    },

    async getEmployerAllJobApplications(employee){
        return await JobApplicationSchema.find({user_id: employee._id});
    },

    async getEmployerAllActiveJobApplications(employee, {pageSize = PAGE_SIZE, pageNo = PAGE_NO}){
        pageSize = parseInt(pageSize);
        pageNo = parseInt(pageNo);
        return await JobApplicationSchema.find({user_id: employee._id})
            .skip(pageSize * pageNo)
            .limit(pageSize)
            .sort({updated_at: -1})
            .lean();
    },

    async getPeopleForJobs(job_id, state, {pageSize, pageNo}){
        pageSize = parseInt(pageSize);
        pageNo = parseInt(pageNo);
        let attributes = ["user_id", "user_cover_pic_url", "user_name", "user_status", "user_overview"];
        if (Array.isArray(state))
            return await JobApplicationSchema.find({job_id, state: {$in: state}})
                .skip(pageSize * pageNo)
                .limit(pageSize)
                .sort({created_at: -1})
                .lean();
        else
            switch (state) {
                case JOB_APPLICATION_STATE.applied :
                    return await jobApplications.getAppliedCandidates({job_id, attributes}, {pageSize, pageNo});
                case JOB_APPLICATION_STATE.hired :
                    return await jobApplications.getHiredCandidates({job_id, attributes}, {pageSize, pageNo});
                case JOB_APPLICATION_STATE.matched :
                    return await jobApplications.getMatchedCandidates({job_id, attributes}, {pageSize, pageNo});
                case JOB_APPLICATION_STATE.interested :
                    return await jobApplications.getShownInterestCandidates({job_id, attributes}, {pageSize, pageNo});
            }
    },

    async getRecommendedCandidates(){
        return [];
    },

    async getAppliedCandidates({job_id, attributes}, {pageSize, pageNo}){
        return await jobApplications.__getStateCandidates({job_id, attributes}, {pageSize, pageNo}, 'applied');
    },

    async getShownInterestCandidates({job_id, attributes}, {pageSize, pageNo}){
        return await jobApplications.__getStateCandidates({job_id, attributes}, {pageSize, pageNo}, 'interested');
    },

    async getMatchedCandidates({job_id, attributes}, {pageSize, pageNo}){
        return await jobApplications.__getStateCandidates({job_id, attributes}, {pageSize, pageNo}, 'matched');
    },

    async getHiredCandidates({job_id, attributes}, {pageSize, pageNo}){
        return await jobApplications.__getStateCandidates({job_id, attributes}, {pageSize, pageNo}, 'hired');
    },

    async getRejectedCandidates(job_id, attributes, {pageSize, pageNo}){
        return await jobApplications.__getStateCandidates({job_id, attributes}, {pageSize, pageNo}, 'applied');
    },

    async getOfferLetterSendCandidates(job_id, attributes, {pageSize, pageNo}){
        return await jobApplications.__getStateCandidates({job_id, attributes}, {pageSize, pageNo}, 'applied');
    },

    async __getStateCandidates({job_id, attributes}, {pageSize = 15, pageNo = 0}, state){
        //todo: attributes
        pageSize = parseInt(pageSize);
        pageNo = parseInt(pageNo);
        return await JobApplicationSchema.find({job_id, state})
            .skip(pageSize * pageNo)
            .limit(pageSize)
            .sort({created_at: -1})
            .lean();
    },

    async getRecommendedCandidatesCount({job_id}){
        return "10K";
    },

    async getAppliedCandidatesCount({job_id}){
        return await jobApplications.__getStateCandidatesCount({job_id}, JOB_APPLICATION_STATE.applied);
    },

    async getMatchedCandidatesCount({job_id}){
        return await jobApplications.__getStateCandidatesCount({job_id}, JOB_APPLICATION_STATE.matched);
    },

    async getHiredCandidatesCount({job_id}){
        return await jobApplications.__getStateCandidatesCount({job_id}, JOB_APPLICATION_STATE.hired);
    },

    async __getStateCandidatesCount({job_id}, state){
        return await JobApplicationSchema.count({job_id, state})
    },

    async getEeActiveChatsJob(user_id, emp_ids){
        return await JobApplicationSchema.aggregate({
            $match: {
                user_id: mongoose.Types.ObjectId(user_id),
                employer_id: {$in: emp_ids},
                state: {
                    $nin: [
                        JOB_APPLICATION_STATE.rejected,
                        JOB_APPLICATION_STATE.hired,
                        JOB_APPLICATION_STATE.not_interested,
                        JOB_APPLICATION_STATE.closed,
                        JOB_APPLICATION_STATE.offer_letter_rejected]
                }
            }
        }, {
            $group: {
                _id: "$employer_id",
                count: {$sum: 1}
            }
        })
    },

    async getErActiveChatsJob(user_ids, employer_id){
        return await JobApplicationSchema.aggregate({
            $match: {
                user_id: {$in: user_ids},
                employer_id: mongoose.Types.ObjectId(employer_id),
                state: {
                    $nin: [
                        JOB_APPLICATION_STATE.rejected,
                        JOB_APPLICATION_STATE.hire,
                        JOB_APPLICATION_STATE.not_interested,
                        JOB_APPLICATION_STATE.closed,
                        JOB_APPLICATION_STATE.offer_letter_rejected
                    ]
                }
            }
        }, {
            $group: {
                _id: "$user_id",
                count: {$sum: 1}
            }
        })
    },

    async getErActiveJobsInfo(user_id, employer_id,){
        return await  JobApplicationSchema.find({
            user_id,
            employer_id,
            state: {
                $nin: [
                    JOB_APPLICATION_STATE.rejected,
                    JOB_APPLICATION_STATE.hire,
                    JOB_APPLICATION_STATE.not_interested,
                    JOB_APPLICATION_STATE.closed,
                    JOB_APPLICATION_STATE.offer_letter_rejected
                ]
            }
        }, {"job_id": 1, "_id": 0})
    },

    async getEeActiveJobsInfo(user_id, employer_id,){
        return await JobApplicationSchema.find({
            user_id,
            employer_id,
            state: {
                $nin: [
                    JOB_APPLICATION_STATE.rejected,
                    JOB_APPLICATION_STATE.hire,
                    JOB_APPLICATION_STATE.not_interested,
                    JOB_APPLICATION_STATE.closed,
                    JOB_APPLICATION_STATE.offer_letter_rejected
                ]
            }
        }, {"job_id": 1, "_id": 0})
    },

    async getAllJobsBetweenEmployerAndEmployee({employer_id, user_id}){
        return await JobApplicationSchema.findAllOrFail({
            employer_id, user_id,
        }, `JobApplication not exist for employer_id ${employer_id} and user_id ${user_id}`);
    },

    async getCountOfJobIds(job_ids){
        let queryViaAggregrate = false;
        if (queryViaAggregrate) {
            let result = await JobApplicationSchema.aggregate([{
                $match: {
                    job_id: {$in: job_ids}
                }
            }, {
                $group: {
                    _id: {
                        state: "$state",
                        job_id: "$job_id"
                    }, count: {$sum: 1}
                }
            }, {
                $group: {
                    "_id": "$_id.job_id",
                    "state": {
                        "$push": {
                            "state": "$_id.state",
                            "count": "$count"
                        },
                    }
                }
            }]);

            let a = [];

            let resultDict = new Map();
            _.map(result, item => {
                resultDict.set(item._id, item.state);
            });

            for (let index = 0; index < job_ids.length; index++) {
                let job_id = job_ids[index];
                let states = resultDict.get(job_id);

                let data = {
                    matched: 0, hired: 0, applications: 0, closed: 0, interested: 0, offer_letter_rejected: 0,
                    offer_letter_sent: 0, not_interested: 0, recommended: 0
                };
                _.map(states, item => {
                    data[item.state] = item.count;
                });
                a.push(data);
            }
            return a;
        } else {
            let a = [];
            for (let index = 0; index < job_ids.length; index++) {
                let job_id = job_ids[index];
                let [matched, hired, applications, closed, interested, offer_letter_rejected,
                    offer_letter_sent, not_interested, recommended] = await Promise.all([
                        JobApplicationSchema.count({job_id, state: JOB_APPLICATION_STATE.matched}),
                        JobApplicationSchema.count({job_id, state: JOB_APPLICATION_STATE.hired}),
                        JobApplicationSchema.count({job_id, state: JOB_APPLICATION_STATE.applied}),
                        JobApplicationSchema.count({job_id, state: JOB_APPLICATION_STATE.closed}),
                        JobApplicationSchema.count({job_id, state: JOB_APPLICATION_STATE.interested}),
                        JobApplicationSchema.count({job_id, state: JOB_APPLICATION_STATE.offer_letter_rejected}),
                        JobApplicationSchema.count({job_id, state: JOB_APPLICATION_STATE.offer_letter_sent}),
                        JobApplicationSchema.count({job_id, state: JOB_APPLICATION_STATE.not_interested}),
                        RecomendedUsersDataManager.getRecommendedUsersCount(job_id)
                    ]
                );
                a.push({
                    matched, hired, applications, closed, interested, offer_letter_rejected,
                    offer_letter_sent, not_interested, recommended
                });
            }
            return a;
        }
    },

    async getAllJobsBetweenEmployerAndEmployeeForShortlist(user_id, employer_id){
        return await JobApplicationSchema.find({
            employer_id, user_id,
            state: {
                $in: [
                    JOB_APPLICATION_STATE.applied
                ]
            }
        }).lean();
    },
    async getAllJobsBetweenEmployerAndEmployeeForReject(user_id, employer_id){
        return await JobApplicationSchema.find({
            employer_id, user_id,
            state: {
                $in: [
                    JOB_APPLICATION_STATE.applied,
                    JOB_APPLICATION_STATE.matched,
                    JOB_APPLICATION_STATE.offer_letter_sent,
                ]
            }
        }).lean();
    },
    async getAllJobsBetweenEmployerAndEmployeeForOfferLetter(user_id, employer_id){
        return await JobApplicationSchema.find({
            employer_id,
            user_id,
            state: {$nin: [JOB_APPLICATION_STATE.closed]}
        }).lean();
    }

};

export default jobApplications;