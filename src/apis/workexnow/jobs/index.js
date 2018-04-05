/**
 * Created By KARTIK AGARWAL
 * on 8 June, 2017
 */
const jobs = require('express').Router();
import jobsApis from "./jobs";
import getjob from "./getjob";
import jobApplication from "./job-application";
import jobUtils from "./job-categories";
import api from "_includes/api";
import auth from "../../../middleware/auth";
import people from "./people";

const authenticateEmployer = [
    auth.authenticate.authenticateEmployer
];

const authenticateEmployee = [
    auth.authenticate.authenticateEmployee
];


jobs.get('/job-tags', api.http(getjob.getJobsTags));
jobs.get('/search', api.http(getjob.getFilterJobs));
jobs.get('/user', authenticateEmployer, api.http(people.getPeoples));
jobs.get('/user-elastic', api.http(people.getPeoplesElastic));

/************************ JOB CATEGORIES API's ************************/
jobs.get('/categories', api.http(jobUtils.getJobCategory));
jobs.get('/categories/:category/images', api.http(jobUtils.getCategoryImages));
jobs.get('/categories/:category/random-images', api.http(jobUtils.getCategoryRandomImages));


/************************ JOB API's ************************/
jobs.get('/jobs', authenticateEmployee, api.http(getjob.getJobs));
jobs.get('/my_jobs', authenticateEmployee, api.http(getjob.getMyActiveJobApplication));

jobs.get('/recommended', authenticateEmployee, api.http(getjob.getRecommendedJobs));
jobs.delete('/recommended/:job_id', authenticateEmployee, api.http(getjob.removeFromRecommendation));
jobs.get('/active', authenticateEmployee, api.http(getjob.getActiveJobs));
jobs.get('/history', authenticateEmployee, api.http(getjob.getJobsHistory));
jobs.get('/job-info/:job_id', authenticateEmployee, api.http(getjob.erJobInfo));
jobs.put('/seen/:job_application_id', authenticateEmployee, api.http(jobApplication.employeeSeenJobsTimeline));
jobs.get('/bookmarked', authenticateEmployee, api.http(getjob.getBookmarkedJobs));
jobs.put('/application/:application_id/seen', authenticateEmployee, api.http(getjob.setSeenApplicationId));

/**
 * Employer Apis
 */
jobs.get('/history-er', authenticateEmployer, api.http(jobsApis.getNonActiveJobs));
jobs.post('/', authenticateEmployer, api.http(jobsApis.postJob));
jobs.get('/', authenticateEmployer, api.http(jobsApis.getActiveJobs));
jobs.put('/:job_id', authenticateEmployer, api.http(jobsApis.updateJob));
jobs.get('/:job_id', authenticateEmployer, api.http(getjob.jobInfo));
jobs.put('/:job_id/remove', authenticateEmployer, api.http(jobsApis.removeJob));
jobs.delete('/:job_id/recommended-employee/:user_id', api.http(getjob.removeFromRecomedation));


/**
 * ATS APIs
 */
jobs.put('/:job_id/accept-interest/', authenticateEmployee, api.http(jobApplication.eeInterested)); // => matched,
jobs.put('/:job_id/interest/:user_id', authenticateEmployer, api.http(jobApplication.erInterested));  // => interested
jobs.put('/:job_id/not-interest', authenticateEmployee, api.http(jobApplication.eeNotInterested)); // => not-interested,
jobs.put('/:job_id/apply', authenticateEmployee, api.http(jobApplication.eeApply)); // => applied
jobs.put('/:job_id/short-list/:user_id/', authenticateEmployer, api.http(jobApplication.erShortList)); // => matched
jobs.put('/:job_id/send-offer-letter/:user_id', authenticateEmployer, api.http(jobApplication.erSendOfferLetter));// => offer_letter_sent
jobs.put('/:job_id/accept-offer-letter', authenticateEmployee, api.http(jobApplication.eeAcceptOfferLetter));// => hired
jobs.put('/:job_id/reject-offer-letter', authenticateEmployee, api.http(jobApplication.eeRejectOfferLetter));// => offer_letter_rejcted
jobs.put('/:job_id/reject/:user_id', authenticateEmployer, api.http(jobApplication.erReject)); // => rejected

export default jobs;
