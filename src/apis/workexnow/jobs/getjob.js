/**
 * Created By KARTIK AGARWAL
 * on 8 June, 2017
 */

import JobUiManager from "../../../ui-manager/jobs";
import JobsEmployerDataManager from "../../../data-manager/JobsEmployer";
import JobsEmployeeDataManager from "../../../data-manager/JobsEmployee";
import RecomendedUsersDataManager from "../../../data-manager/RecomendedUsers";
import RecomendedJobsDataManager from "../../../data-manager/RecomendedJobs";
import UserProfileDataManager from "../../../data-manager/UserProfileDataManager";
import JobsDataManager from "../../../data-manager/Jobs";
import JobApplicationDataManager from "../../../data-manager/JobApplicationDataManger";
import * as errors from "../../../errors";
import jobLibs from "./job-libs";
import {PAGE_NO, PAGE_SIZE, URLS} from "../../../constants/application";
import {getJobSearchTags} from "../../../elastic-search/JobTags";

let getJobsApis = {

    async removeFromRecommendation(object, options){
        let {user: employee, params} = options;
        let {job_id} = params;
        let user_id = employee._id;

        let {nModified} = await RecomendedJobsDataManager.removeJobfromRecomendation(user_id, job_id);

        if (nModified)
            return {
                message: "Successfully removed from Recommended"
            };

        throw new errors.ValidationError({message: "Not a recommended Job"});
    },

    async getRecommendedJobs(object, options){

        let {user: employee} = options;
        let {pageSize = 15, pageNo = 0, min_salary = 0, max_salary = 100000, type, job_days, city, q = ''} = options.query;

        pageSize = parseInt(pageSize);
        pageNo = parseInt(pageNo);
        min_salary = parseInt(min_salary);
        max_salary = parseInt(max_salary);

        let query = {
            min_salary: {$gt: min_salary},
            max_salary: {$lt: max_salary}
        };

        if (city)
            query.city = city;
        if (type)
            query.type = {$in: type};
        if (job_days)
            query.job_days = {$in: job_days};

        let recommendedJobs = RecomendedJobsDataManager.getRecommendedJobs(employee, {pageSize, pageNo});

        if (recommendedJobs)
            query._id = {$in: recommendedJobs};

        if (q && q.length > 2) {
            query = {
                _id: {$in: recommendedJobs},
                $or: [
                    {job_title: {$regex: new RegExp(q, "i")}},
                    {city: {$regex: new RegExp(q, "i")}},
                    {company_name: {$regex: new RegExp(q, "i")}},
                    {description: {$regex: new RegExp(q, "i")}},
                    {category: {$regex: new RegExp(q, "i")}},
                    {type: {$regex: new RegExp(q, "i")}}
                ]
            };
        }

        let jobs = await JobsEmployeeDataManager.findJobs(query);

        let bookmarkMap = await jobLibs.getBookMarkMap(employee._id);

        let jobsToSend = [];
        _.map(recommendedJobs, recommendedJob => {
            let job = _.find(jobs, {"_id": recommendedJob});
            if (job) {
                let {
                    _id, job_title, company_name, description, created_at, address, location,
                    company_logo_url, city, type, min_salary, max_salary, work_experience,
                } = job;

                jobsToSend.push({
                    type_text: JobUiManager.getReaadableJobType(type),
                    _id, min_salary, max_salary, work_experience, type, city,
                    job_title, company_name,
                    description: JobUiManager.getShortJobDescription(description),
                    company_logo_url,
                    created_at: moment(created_at).fromNow(),
                    is_bookmarked: bookmarkMap.get(_id.toHexString()) || false
                });
            }
        });

        return {
            data: {
                jobs: jobsToSend,
                meta: {
                    pageSize,
                    pageNo
                }
            },
            message: "Recommended Jobs fetched successfully"
        }

    },


    async getJobsHistory(object, options){

        let {user: employee} = options;
        let {pageSize = 15, pageNo = 0} = options.query;


        let [jobApplications, jobs_count] = await Promise.all([
            JobsEmployeeDataManager.getJobHistory({employee}, {pageSize, pageNo}),
            JobsEmployeeDataManager.getJobHistoryCount({employee}),
        ]);

        jobApplications = _.map(jobApplications, job => {
            let {
                seen_by_employee,
                _id, state, created_at, job_id, state_stack,
                company_logo_url = URLS.profile_pic,
                company_name = "company_name", job_title = "job_title", min_salary = 1000, max_salary = 2000, company_contact_number = "9654013024",
                type = "part_time", city = "city"
            } = job;

            state_stack = _.map(state_stack, ({time, state}) => {
                return {
                    time: moment(time).format('MMMM Do, h:mm a'),
                    state: state,
                    state_text: JobUiManager.getReadbleState(state)
                }
            });

            return {
                job_applications_id: _id,
                _id, seen_by_employee, job_id, company_logo_url, company_name,
                job_title, min_salary, state_stack, max_salary,
                company_contact_number, type, state,
                type_text: JobUiManager.getReaadableJobType(type),
                state_text: JobUiManager.getReadbleState(state),
                created_at: moment(created_at).fromNow()
            };
        });

        return {
            data: {
                jobs: jobApplications,
                job_applications: jobApplications,
                meta: {
                    total_records: jobs_count,
                    pageSize,
                    pageNo,
                    page_size: pageSize,
                    page_no: pageNo
                }
            },
            message: "History Jobs fetched successfully",
            info: "job is absolue use job_applications instead"
        }
    },

    async getActiveJobs(object, options){
        let {user: employee} = options;
        let {pageSize, pageNo} = options.query;

        let jobApplications = await
            JobsEmployeeDataManager.getJobActive({employee}, {pageSize, pageNo});
        jobApplications = JobUiManager.getEmployeeJobApplicationCard(jobApplications);

        return {
            data: {
                jobs: jobApplications,
                job_applications: jobApplications,
                meta: {
                    total_records: jobs_count,
                    pageSize,
                    pageNo,
                    page_size: pageSize,
                    page_no: pageNo
                }
            },
            message: "Recommended Jobs fetched successfully",
            info: "job is absolue use job_applications instead"
        }
    },

    async getFilterJobs(object, options){
        let {user: employee} = options;
        let {pageSize = 15, pageNo = 0, min_salary = 0, max_salary = 100000, type, job_days, city, q = ''} = options.query;
        if (q === '') {
            q = undefined;
        }

        min_salary = parseInt(min_salary);
        max_salary = parseInt(max_salary);

        let query = {
            min_salary: {$gt: min_salary},
            max_salary: {$lt: max_salary}
        };

        if (city)
            query.city = city;
        if (type)
            query.type = {$in: type};
        if (job_days)
            query.job_days = {$in: type};

        let filteredJobs = await JobsEmployeeDataManager.findJobs(query, {pageSize, pageNo});


        return {
            data: {
                jobs: filteredJobs,
                meta: {
                    pageSize,
                    pageNo
                }
            },
            message: "Filter job fetched successfully"
        }
    },

    async getBookmarkedJobs(object, options) {
        let {user} = options;

        let {bookmarks = []} = await UserProfileDataManager.findOne({user_id: user._id}, ["bookmarks"]) || {};
        let jobs = await JobsEmployerDataManager.findJobs({_id: {$in: bookmarks}});

        return {
            data: {
                jobs: _.map(jobs, job => {
                    return Object.assign({}, job, {
                        created_at: moment(job.created_at).fromNow(),
                        is_bookmarked: true
                    })
                })
            },
            message: "Bookmarked jobs fetched successfully"
        }
    },

    async jobInfo(object, options){
        let {job_id} = options.params;

        let jobInfo = await JobsDataManager.findOrFail(job_id);

        jobInfo = _.pick(jobInfo, ["_id", "location", "compensation", "cover_pic_url", "title", "created_at", "is_active",
            "description", "min_salary", "max_salary", "work_experience", "type", "category", "views", "share", "city"]);

        let counts = await JobApplicationDataManager.getCountOfJobIds([job_id]);

        let {
            matched, hired, applications, closed, interested, offer_letter_rejected,
            offer_letter_sent, not_interested, recommended
        } = counts[0];


        let data = JobUiManager.getEmployerJobDetailedCard(jobInfo, {
            matched, applications, closed, interested, offer_letter_rejected,hired,
            offer_letter_sent, not_interested, recommended,
        });

        return {
            data,
            message: "Info fetched successfully"
        }
    },

    async erJobInfo(object, options){
        let {job_id} = options.params;
        let {user} = options;

        let [userProfile, jobInfo, jobApplication] = await  Promise.all([
            UserProfileDataManager.findOne({user_id: user._id}),
            JobsDataManager.findOrFail(job_id),
            JobsEmployeeDataManager.getJobApplicationDetails({job_id, user_id: user._id})
        ]);

        let bookmarksJobs = [];
        if (userProfile)
            bookmarksJobs = _.map(userProfile.bookmarks, bookmark => bookmark.toHexString());

        //check job is bookmarked or not
        let is_bookmarked = _.findIndex(bookmarksJobs, (bookmarksJob) => bookmarksJob == job_id) >= 0;

        jobInfo.job_id = jobInfo._id;
        jobInfo.type_text = JobUiManager.getReaadableJobType(jobInfo.type);
        jobInfo = jobInfo.toJSON();
        if (jobApplication) {
            jobInfo.state_text = JobUiManager.getReadbleState(jobApplication.state);
        }
        JobsDataManager.increaseViewCount(job_id);

        return {
            data: Object.assign({}, jobInfo, {
                is_active: jobInfo.is_active,
                type_text: JobUiManager.getReaadableJobType(jobInfo.type),
                category: JobUiManager.getCategoryDisplayText(jobInfo.category[0]),
                created_at: moment(jobInfo.created_at).fromNow(),
                job_id: jobInfo._id,
                is_bookmarked,
                is_application_exist: !!jobApplication,
                state: jobApplication ? jobApplication.state : undefined
            }),
            message: "Info fetched successfully",
        }
    },

    async removeFromRecomedation(object, options){
        let {params} = options;
        let {user_id, job_id} = params;

        let {nModified} = await RecomendedUsersDataManager.removeUserfromRecomendation(job_id, user_id);

        if (nModified)
            return {
                message: "removed from Recommendation"
            };

        throw  new errors.ValidationError({message: "Not a recommended User"});
    },

    async getRecommended(object, options){
        let {job_id} = options.params;
        let {pageSize = 15, pageNo = 0} = options.query;

        let recommendedUsers = await RecomendedUsersDataManager.getRecommendedUsers(job_id, {pageNo, pageSize});
        let candidates = await UserProfileDataManager.find({user_id: {$in: recommendedUsers}}, 'user_id profile_pic_url name total_experience user_city');

        let candidatesToSend = [];
        _.map(recommendedUsers, recommendedUser => {
            let candidate = _.find(candidates, {"user_id": recommendedUser});
            if (candidate) {
                candidatesToSend.push({
                    _id: candidate.user_id,
                    user_name: candidate.name,
                    user_experience: candidate.total_experience,
                    user_profile_pic_url: candidate.profile_pic_url
                });
            }
        });

        return {
            data: {
                candidates: candidatesToSend,
                meta: {
                    pageSize, pageNo
                }
            },
            message: "Recommended employees fetched successfully"
        }
    },

    async getRecommendedUserCount(job_id){
        return await  RecomendedUsersDataManager.getRecommendedUsersCount(job_id);
    },

    async getMatched(object, options){
        let {job_id} = options.params;
        let {pageSize, pageNo} = options.query;

        let attributes = 'user_profile_pic_url user_name user_experience user_city user_id state';
        let [candidates, matched_count] = await Promise.all([
            JobsEmployerDataManager.getMatchedCandidates({job_id, attributes}, {pageNo, pageSize}),

        ]);

        candidates = _.map(candidates, (candidate, index) => {
            return Object.assign({}, candidate, {
                state_text: JobUiManager.getReadbleState(candidate.state),
                user_id: candidate.user_id,
                _id: candidate.user_id,
            })
        });

        return {
            data: {
                candidates,
                meta: {
                    total_records: matched_count,
                    page_size: pageSize,
                    page_no: pageNo
                }
            },
            message: "matched candidates fetched successfully"
        }

    },

    async getShownInterest(object, options){
        let {job_id} = options.params;
        let {pageSize, pageNo} = options.query;

        let attributes = 'user_id user_profile_pic_url user_name user_experience user_city state';
        let candidates = await JobsEmployerDataManager.getShownInterestCandidates({job_id, attributes}, {
            pageSize,
            pageNo
        });

        candidates = _.map(candidates, (candidate, index) => {
            return Object.assign({}, candidate, {
                state_text: JobUiManager.getReadbleState(candidate.state),
                _id: candidate.user_id,
            })
        });

        return {
            data: {
                candidates,
                meta: {
                    page_size: pageSize,
                    page_no: pageNo
                }
            },
            message: "interested candidates fetched successfully"
        }

    },

    async getApplied(object, options){
        let {job_id} = options.params;
        let {pageSize, pageNo} = options.query;

        let attributes = 'user_id user_profile_pic_url user_name user_experience user_city';
        let candidates = await JobsEmployerDataManager.getAppliedCandidates({job_id, attributes}, {pageSize, pageNo});

        candidates = _.map(candidates, (candidate, index) => {
            return Object.assign({}, candidate, {
                state_text: JobUiManager.getReadbleState(candidate.state),
                _id: candidate.user_id,
            })
        });

        return {
            data: {
                candidates,
                meta: {
                    pageSize, pageNo
                }
            },
            message: "applied candidates fetched successfully"
        }

    },

    async getHired(object, options){
        let {job_id} = options.params;
        let {pageSize, pageNo} = options.query;

        let attributes = 'user_id user_profile_pic_url user_name user_experience user_city offer_letter';
        let candidates = await JobsEmployerDataManager.getHiredCandidates({job_id, attributes}, {pageSize, pageNo});

        candidates = _.map(candidates, (candidate, index) => {
            return Object.assign({}, {
                _id: candidate.user_id,
                user_profile_pic_url: candidate.user_profile_pic_url,
                user_name: candidate.user_name,
                user_experience: candidate.user_experience,
                user_city: candidate.user_city,
                offer_letter: candidate.offer_letter
            });
        });

        return {
            data: {
                candidates,
                meta: {
                    pageSize, pageNo
                }
            },
            message: "hired candidates fetched successfully"
        }
    },

    async getJobs(object, options){
        let {user} = options;
        let {pageSize = PAGE_SIZE, pageNo = PAGE_NO, q = '', job_type, city} = options.query;
        if (q === '') {
            q = undefined;
        }
        let jobs = [];
        if (UserProfileDataManager.canApplyOnJob(user)) {

            let recommendedJobs = await RecomendedJobsDataManager.getAllRecommendedJobs(user);
            let query = {};

            if (recommendedJobs)
                query._id = {$in: recommendedJobs};
            if (job_type)
                query.type = {$in: job_type};
            if (city)
                query.city = city;

            if (q && q.length > 2) {
                query = {
                    _id: {$in: recommendedJobs},
                    $or: [
                        {job_title: {$regex: new RegExp(q, "i")}},
                        {city: {$regex: new RegExp(q, "i")}},
                        {description: {$regex: new RegExp(q, "i")}},
                        {category: {$regex: new RegExp(q, "i")}},
                        {type: {$regex: new RegExp(q, "i")}}
                    ]
                };
            }
            jobs = await JobsEmployeeDataManager.findJobs(query, {pageSize, pageNo});
        } else {
            jobs = await JobsEmployerDataManager.getAllJobs({pageSize, pageNo});
        }
        let data = _.map(jobs, job => JobUiManager.getEmployeeJobCard(job));
        return {
            data: {
                jobs: data,
                meta: {
                    pageSize,
                    pageNo
                },
            },
            message: "Jobs fetched successfully"
        }
    },

    async getMyJobApplication(object, options){
        let {user: employee} = options;
        let jobs = await JobApplicationDataManager.getEmployerAllJobApplications(employee);
        let data = _.map(jobs, job => JobUiManager.getEmployeeJobApplicationCard(job));
        return {
            data,
            message: "Jobs fetched successfully"
        }
    },

    async getMyActiveJobApplication(object, options){
        let {user: employee, query} = options;
        let {pageSize, pageNo} = query;
        let jobs = await JobApplicationDataManager.getEmployerAllActiveJobApplications(employee, {pageSize, pageNo});
        let data = _.map(jobs, job => JobUiManager.getEmployeeJobApplicationCard(job));
        data.meta = {
            pageSize,
            pageNo
        };

        let profilePer = await UserProfileDataManager.getProfilePercentage(employee._id);
        return {
            data: {
                jobs: data,
                meta: {
                    pageSize,
                    pageNo,
                    profile_percentage: profilePer
                },
            },
            message: "Jobs fetched successfully"
        }
    },


    async getJobsTags(object, options){
        let {q} = options.query;

        let data = await getJobSearchTags(q);
        return {
            data,
            message: "",
            info: "this api is in completed"
        }
    }
};

export default getJobsApis;
