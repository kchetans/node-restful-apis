import JobsUiManager from "./jobs";
import {URLS} from "../constants/application";
import {getMediumProfilePicUrl, getMinProfilePicUrl, getUserCoverPicForMobile} from "./ImageUrlParser";
let users = {

    getShortProfile(userProfile){
        if (!userProfile.profile_pic_url)
            userProfile.profile_pic_url = URLS.profile_pic;
        return {
            name: userProfile.name,
            profile_pic_url: getMinProfilePicUrl(userProfile.profile_pic_url),
            user_id: userProfile._id
        };
    },

    getMyProfile(profile = {}, viewCount = 0){
        let {_id: user_id, mobile_no, roles, is_mobile_verified, is_email_verified, full_time_preferences, part_time_preferences} = profile;

        profile.full_time_preferences = JobsUiManager.getCategoryText(full_time_preferences);
        profile.part_time_preferences = JobsUiManager.getCategoryText(part_time_preferences);
        profile.views = viewCount;
        profile.profile_id = profile._id;
        profile._id = undefined;
        profile.dob_text = profile.dob ? moment(profile.dob).format('Do MMMM YYYY') : '';
        profile.profile_pic_url = getMediumProfilePicUrl(profile.profile_pic_url);
        profile.cover_pic_url = getUserCoverPicForMobile(profile.cover_pic_url);

        return Object.assign({}, profile, {user_id, mobile_no, roles, is_mobile_verified, is_email_verified});
    },

    getExperience(experience){
        let {company, duration, designation, is_current_job, doj, dol, _id} = experience;
        return {
            work_experience_id: _id,
            company: company,
            designation: designation,
            is_current_job: is_current_job || false,
            doj: doj,
            dol: dol,
            duration: is_current_job ? doj ? `${moment(doj).format('MMM, YYYY')} - Present` : "Present" :
                doj && dol ? `${users.getDuration(doj, dol)} (${moment(doj).format('MMM, YYYY')}-${moment(dol || new Date()).format('MMM, YYYY')})`
                    : ''
        };
    },

    getDuration(doj, dol){
        let months = moment(dol || new Date()).diff(doj, 'months');
        let years = parseInt(months / 12);
        months = months % 12;
        if (years > 0 && months > 0) {
            return `${years} Years ${months} Months`;
        }
        if (years > 0 && months === 0) {
            return `${years} Years`;
        }
        if (years === 0 && months > 0) {
            return `${months} Months`;
        }
        if (years === 0 && months === 0) {
            return ``;
        }
    },

    getEducation(experiences = {}){
        let {institute, course, start_date, end_date, _id, is_currently_pursuing} = experiences;
        return {
            education_id: _id,
            institute, course,
            start_date, end_date,
            is_currently_pursuing: is_currently_pursuing || false,
            duration: is_currently_pursuing ? start_date ? `${moment(start_date).format('MMM, YYYY')} - Present` : "Present" :
                start_date && end_date ? `${users.getDuration(start_date, end_date)} (${moment(start_date).format('MMM, YYYY')}-${moment(end_date || new Date()).format('MMM, YYYY')})`
                    : ''
        }
    },

    getSkillCertification(experiences = {}){
        let {institute, course, start_date, end_date, _id} = experiences;
        return {
            skill_certification_id: _id,
            institute, course,
            start_date, end_date,
            duration: `${moment(start_date).format('YYYY')}-${moment(end_date).format('YYYY')}`
        }
    },

};

export default users;