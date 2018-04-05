import ConfigDataManager from "../data-manager/Configs";
import {JOB_APPLICATION_STATE} from "../constants/application";
import {USER_OVERVIEW} from "../constants/notification-messages";
import format from "string-template";
import {getJobCoverPicForMobile} from "./ImageUrlParser";

let JobUiManager = {

    getEmployeeJobCard(newJob, requestSource){
        let {compensation, type, title, description, created_at, _id, category, cover_pic_url, city} = newJob;

        cover_pic_url = getJobCoverPicForMobile(cover_pic_url);
        return {
            job_id: _id, cover_pic_url,
            type: type, type_text: JobUiManager.getReaadableJobType(type),
            title, city, compensation, text: description, description,
            time: moment(created_at).fromNow(),
            category: JobUiManager.getCategoryText(category),
        }
    },

    getEmployeeJobApplicationCard(jobApplications){
        let {
            _id: job_applications_id, job_id, job_posting, user_id,
            employer_id, user_profile, offer_letter, seen_by_employee, state_stack, state
        } = jobApplications;
        let {} = user_profile;
        let {
            created_at, description, company_logo_url, company_name, min_salary,
            max_salary, type, category, title, city, compensation, cover_pic_url
        } = job_posting;

        state_stack = _.map(state_stack, ({time, state, pending_action_id}) => {
            return {
                pending_action_id, state,
                time: moment(time).format('MMMM Do, h:mm a'),
                state_text: JobUiManager.getReadbleState(state)
            }
        });
        if (offer_letter)
            offer_letter.date_of_joining = moment(offer_letter.date_of_joining).format('MMMM Do');

        cover_pic_url = getJobCoverPicForMobile(cover_pic_url);
        return {
            city, job_id, job_applications_id, cover_pic_url, offer_letter, seen_by_employee, company_logo_url,
            compensation, description, employer_id, company_name, title, min_salary, max_salary, type, state_stack,
            state, type_text: JobUiManager.getReaadableJobType(type),
            state_text: JobUiManager.getReadbleState(state),
            category: JobUiManager.getCategoryText(category),
            time: moment(created_at).fromNow()
        };
    },

    getEmployerJobCard(job, {
        matched, hired, applications, closed, interested, offer_letter_rejected,
        offer_letter_sent, not_interested, recommended
    }, requestSource){
        let {
            title, compensation, _id: job_id, city, type, description,
            created_at, cover_pic_url, category, location, is_active
        } = job;
        cover_pic_url = getJobCoverPicForMobile(cover_pic_url);
        return {
            compensation, job_id, cover_pic_url, city, location, type,
            is_active: is_active || false,
            type_text: JobUiManager.getReaadableJobType(type, requestSource),
            title: title,
            category: JobUiManager.getCategoryText(category),
            description,
            time: moment(created_at).fromNow(),
            stats: {
                matched, hired, applications, closed, interested, offer_letter_rejected,
                offer_letter_sent, not_interested, recommended,
            }
        };
    },

    getEmployerJobCardForChat(job_application, requestSource){
        let {_id: job_application_id, job_id, job_posting, state} = job_application;
        let {
            title, compensation, city, type, description,
            created_at, cover_pic_url, category, location
        } = job_posting;

        cover_pic_url = getJobCoverPicForMobile(cover_pic_url);
        return {
            state, job_application_id,
            compensation, job_id, cover_pic_url, city, title, description,
            state_text: JobUiManager.getReadbleState(state),
            type_text: JobUiManager.getReaadableJobType(type, requestSource),
            category: JobUiManager.getCategoryText(category),
            time: moment(created_at).fromNow(),
        };
    },

    getEmployerJobCardForChatNonAppliedJob(job_posting, requestSource){
        let {
            title, compensation, city, type, description,
            created_at, cover_pic_url, category, location, _id: job_id
        } = job_posting;
        cover_pic_url = getJobCoverPicForMobile(cover_pic_url);
        return {
            compensation, job_id, cover_pic_url, city, title, description,
            type_text: JobUiManager.getReaadableJobType(type, requestSource),
            category: JobUiManager.getCategoryText(category),
            time: moment(created_at).fromNow(),
        };
    },

    getEmployerPeopleCard(people){
        let {_id, user_id, cover_pic_url, name, status, current_location, company_name, total_experience, education, profile_pic_url} = people;
        cover_pic_url = getJobCoverPicForMobile(cover_pic_url);
        return {
            user_id: _id, profile_pic_url, cover_pic_url,
            name: name,
            status_statement: status,
            current_location,
            overview: company_name && total_experience ? format(USER_OVERVIEW, {
                company_name,
                total_experience,
                education
            }) : ''
        }

    },

    getEmployerPeopleCardFromApplication(people){
        let {
            _id, job_id, job_posting, user_profile = {},
            employer_id, state, state_stack
        } = people;

        let {
            _id: user_id, cover_pic_url, name, status, overview, user_cover_pic_url, user_name,
            user_status, profile_pic_url, user_profile_pic_url,
            company_name, total_experience, education
        } = user_profile;


        return {
            // is_star: _.random(0, 5) % 2 == 0,
            user_id, state,
            state_text: JobUiManager.getReadbleState(state),
            profile_pic_url: profile_pic_url || user_profile_pic_url,
            cover_pic_url: cover_pic_url || user_cover_pic_url,
            name: name || user_name,
            status_statement: status || user_status,
            overview: company_name && total_experience ? format(USER_OVERVIEW, {
                company_name,
                total_experience,
                education
            }) : '',
        }
    },

    getEmployerJobDetailedCard(job, {
        matched = 0, hired = 0,
        applications = 0, closed = 0,
        interested = 0, offer_letter_rejected = 0,
        offer_letter_sent = 0, not_interested = 0, recommended = 0
    }, requestSource){
        let {city, category, compensation, _id: job_id, type, is_active, description, created_at, cover_pic_url, location, title} = job;
        cover_pic_url = getJobCoverPicForMobile(cover_pic_url);
        return {
            compensation, job_id, cover_pic_url, location,
            is_active,
            type_text: JobUiManager.getReaadableJobType(type, requestSource),
            category: JobUiManager.getCategoryText(category),
            title, description,
            time: moment(created_at).fromNow(),
            city: city,
            stats: {
                matched, hired,
                applications, closed,
                interested, offer_letter_rejected,
                offer_letter_sent, not_interested, recommended
            }
        };
    },

    //todo
    getReadbleState(state){
        switch (state) {
            case JOB_APPLICATION_STATE.applied :
                return "Applied";
            case JOB_APPLICATION_STATE.interested :
                return "Interest Received";
            case  JOB_APPLICATION_STATE.not_interested:
                return "Interest Declined";
            case JOB_APPLICATION_STATE.matched :
                return "Matched";
            case JOB_APPLICATION_STATE.rejected :
                return "Rejected";
            case JOB_APPLICATION_STATE.hired :
                return "Hired";
            case JOB_APPLICATION_STATE.offer_letter_sent :
                return "Offered";
            case JOB_APPLICATION_STATE.closed :
                return "Closed";
            case JOB_APPLICATION_STATE.offer_letter_rejected:
                return "Offer Letter Rejected";
            default :
                return "In process";
        }
    },


    getReaadableJobType(type, requestSource){
        switch (type) {
            case  "full_time" :
                return "Full Time";
            case  "part_time" :
                return "Part Time";
            default :
                return "Others";
        }
    },

    getShortJobDescription(desc, {requestSource}){
        if (desc && desc.length < 50)
            return desc;
        return desc && desc.substring(0, 40) + " ...";
    },

    getJobTitleFromDescription(desc, requestSource){
        if (desc && desc.length < 50)
            return desc;
        let a = desc && desc.substring(0, 40);
        return `${a} ...`;
    },

    getCategoryText(category_keys){
        let categories = ConfigDataManager.getJobCategory();
        if (Array.isArray(category_keys))
            category_keys = _.map(category_keys, category_key => {
                return {value: category_key}
            });
        else
            category_keys = {value: category_keys};
        return _.intersectionBy(categories, category_keys, 'value');
    },


    getCategoryDisplayText(category_key){
        let categories = ConfigDataManager.getJobCategory();
        let returnValue = '';
        _.forEach(categories, category => {
            if (category.value === category_key)
                returnValue = category.key;
        });
        return returnValue || "Others";
    },

    getDbFormatedCategories(categories){
        if (!Array.isArray(categories))
            categories = [categories];
        return _.map(categories, category => {
            if (category.key && category.value)
                return category.value;
            else
                return category
        })
    }

};

export default JobUiManager;