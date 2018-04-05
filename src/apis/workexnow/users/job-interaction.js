/**
 * Created By KARTIK AGARWAL
 * on 15 Jun 2017
 */
import JobApplicationDataManager from "../../../data-manager/JobApplicationDataManger";
import JobsEmployerDataManager from "../../../data-manager/JobsEmployer";
import JobUiManager from "../../../ui-manager/jobs";
let jobInterection = {

    async getActiveJobs(object, options){
        let {user: employer, params} = options;
        let {user_id: employee_id} = params;

        let [shortlist, reject, offer_letter] = await  Promise.all([
            JobApplicationDataManager
                .getAllJobsBetweenEmployerAndEmployeeForShortlist(employee_id, employer._id),
            JobApplicationDataManager
                .getAllJobsBetweenEmployerAndEmployeeForReject(employee_id, employer._id),
            JobApplicationDataManager
                .getAllJobsBetweenEmployerAndEmployeeForOfferLetter(employee_id, employer._id),
        ]);

        let removeIds = _.map(offer_letter, item => item.job_id.toHexString());

        let filterActiveJobs = await JobsEmployerDataManager.getAllActiveJobs({employer}, removeIds);

        filterActiveJobs = _.map(filterActiveJobs, item => JobUiManager.getEmployerJobCardForChatNonAppliedJob(item));

        shortlist = _.map(shortlist, item => JobUiManager.getEmployerJobCardForChat(item));
        reject = _.map(reject, item => JobUiManager.getEmployerJobCardForChat(item));
        offer_letter = _.map(offer_letter, item => JobUiManager.getEmployerJobCardForChat(item));

        offer_letter = offer_letter.concat(filterActiveJobs);
        shortlist = shortlist.concat(filterActiveJobs);

        return {
            data: {
                shortlist,
                reject,
                offer_letter
            },
            message: "Ok"
        }

    }
};

export default jobInterection;