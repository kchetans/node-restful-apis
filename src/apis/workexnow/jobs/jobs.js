/**
 * Created By KARTIK AGARWAL
 * on 8 June, 2017
 */
import recommendationJobs from "./recomedation-candidates";
import JobsEmployerDataManager from "../../../data-manager/JobsEmployer";
import JobApplicationDataManager from "../../../data-manager/JobApplicationDataManger";
import UserProfileDataManager from "../../../data-manager/UserProfileDataManager";
import RecomendationJobs from "../../../data-manager/RecomendedJobs";
import RecomendedUsers from "../../../data-manager/RecomendedUsers";
import JobUiManager from "../../../ui-manager/jobs";
import jobLibs from "./job-libs";
import chatMethods from "../chats/chat-socket-method";
let createJob = {

    async postJob(object, options){
        let {user: employer} = options;

        await UserProfileDataManager.canPostJobOrFail(employer);

        //todo : remove city,
        let objectToSave = _.pick(object, [
            "location", "cover_pic_url", "compensation", "title", "category", "type", "description", "city",
            "address", "address_raw", "mode"
        ]);

        if (!objectToSave.contact_name)
            objectToSave.contact_name = employer.name;
        if (!objectToSave.contact_email)
            objectToSave.contact_email = employer.email;
        if (!objectToSave.contact_number)
            objectToSave.contact_number = employer.mobile_no;
        objectToSave.employer_id = employer._id;
        if (objectToSave.description)
            objectToSave.description = objectToSave.description.trim();

        objectToSave.title = JobUiManager.getJobTitleFromDescription(objectToSave.description);

        objectToSave.category = JobUiManager.getDbFormatedCategories(objectToSave.category);

        if (objectToSave.location)
            objectToSave.location.lon = objectToSave.location.lng;

        /** Save JOb**/
        let newJob = await JobsEmployerDataManager.postJob({object: objectToSave, user: employer});

        /** Get job location and store**/
        if (!objectToSave.location)
            jobLibs.getLocationAndStore(newJob._id, {address: objectToSave.address, city: objectToSave.city}, employer);
        /** Store company logo**/
        // jobLibs.getCompanyLogoAndStore(newJob._id, employer);
        /** Calculate recommended user fot that job**/
        recommendationJobs.saveRecommendedCandidatesForJobAndJobForCandidates(newJob._id);

        newJob = JobUiManager.getEmployeeJobCard(newJob);

        return {
            data: newJob,
            message: "Job posted successfully"
        }
    },

    async updateJob(object, options){
        let {job_id} = options.params;

        object.category = JobUiManager.getDbFormatedCategories(object.category);

        return {
            data: await JobsEmployerDataManager.updateJob(job_id, object),
            message: "Jobs updated successfully"
        };

    },

    async removeJob(object, options){
        let {params, user: employer} = options;
        let {job_id} = params;
        let jobInfo = await JobsEmployerDataManager.closeJob(job_id);

        RecomendationJobs.removeJobfromRecomendationFromAllUser(job_id);
        RecomendedUsers.removeAllUserfromRecomendation(job_id);

        let userIdList = await JobApplicationDataManager.updateApplicantStatus(job_id, jobInfo);

        let user_pending_actions = await UserProfileDataManager.find({_id: {$in: userIdList}}, "pending_actions");
        let pending_action_ids_to_remove = [];
        _.map(user_pending_actions, user_pending_action_item => {
            let {pending_actions} = user_pending_action_item;
            _.map(pending_actions, pending_action_item => {
                if (pending_action_item.job_id.toHexString() === job_id) {
                    pending_action_ids_to_remove.push(pending_action_item._id);
                }
            });
        });

        chatMethods.closeAllCardsForJob(pending_action_ids_to_remove, job_id, userIdList, employer._id);

        //find employer pending_actions for this jobs.
        let employer_pending_action_ids_to_remove = [];
        let employer_pending_actions = employer.pending_actions;
        _.map(employer_pending_actions, pending_action_item => {
            if (pending_action_item.job_id.toHexString() === job_id) {
                employer_pending_action_ids_to_remove.push(pending_action_item._id);
            }
        });

        chatMethods.closeAllCardsOfEmployerForJob(employer_pending_action_ids_to_remove, job_id, userIdList, employer._id);


        return {
            message: "Job Application is taken down"
        }
    },

    async getActiveJobs(object, options){
        let {user: employer} = options;
        let {pageSize = 15, pageNo = 0} = options.query;
        let attributes = '_id is_active city location compensation cover_pic_url created_at title company_logo_url company_name description category type min_salary max_salary work_experience no_of_open_vacancies no_of_applicant no_of_close_vacancies views share';
        let jobs = await JobsEmployerDataManager.getActiveJobs({employer, attributes}, {pageNo, pageSize});
        let statesCount = await JobApplicationDataManager.getCountOfJobIds(_.map(jobs, job => job._id));
        jobs = _.map(jobs, (job, index) => JobUiManager.getEmployerJobCard(job, statesCount[index]));

        return {
            data: {
                jobs,
                meta: {
                    pageSize,
                    pageNo,
                }
            },
            message: "Jobs fetched successfully"
        }
    },

    async getNonActiveJobs(object, options){
        let {user: employer, query} = options;
        let {pageSize, pageNo} = query;
        let attributes = 'company_logo_url title company_name category type no_of_close_vacancies min_salary max_salary no_of_applicant';
        let jobs = JobsEmployerDataManager.getClosedJobs({employer, attributes}, {pageSize, pageNo});
        jobs = _.map(jobs, (job, index) => JobUiManager.getEmployerJobCard(job));
        return {
            data: {
                jobs,
                meta: {
                    pageSize,
                    pageNo,
                }
            },
            message: "Jobs history fetched successfully"
        }
    }
};

export default createJob;