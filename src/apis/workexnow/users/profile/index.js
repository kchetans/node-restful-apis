/**
 * Created By KARTIK AGARWAL
 * on 8 June, 2017
 */
const userRoutes = require('express').Router();

import profile from "./profile";
import education from "./education";
import experience from "./experience";
import documents from "./documents";
import resume from "./resume";
import review from "./review";
import skillCertification from "./skill-certification";
import api from "_includes/api";


userRoutes.put('/', api.http(profile.updateProfile));
userRoutes.get('/', api.http(profile.getMyProfile));


userRoutes.get('/resume/:user_id', api.http(resume.getUserResume));

/**
 * Experience apis
 */
userRoutes.get('/experience', api.http(experience.getAllExperience));
userRoutes.get('/experience/:experience_id', api.http(experience.getExperience));
userRoutes.post('/experience', api.http(experience.addExperience));
userRoutes.put('/experience/:experience_id', api.http(experience.updateExperience));
userRoutes.delete('/experience/:experience_id', api.http(experience.removeExperience));

/**
 * Education apis
 */
userRoutes.get('/education', api.http(education.getAllEducation));
userRoutes.get('/education/:education_id', api.http(education.getEducation));
userRoutes.post('/education', api.http(education.addEducation));
userRoutes.put('/education/:education_id', api.http(education.updateEducation));
userRoutes.delete('/education/:education_id', api.http(education.removeEducation));

/**
 * Education apis
 */
userRoutes.get('/skill-certification', api.http(skillCertification.getAllSkillAndCertification));
userRoutes.get('/skill-certification/:skill_certification_id', api.http(skillCertification.getSkillAndCertification));
userRoutes.post('/skill-certification', api.http(skillCertification.addSkillAndCertification));
userRoutes.put('/skill-certification/:skill_certification_id', api.http(skillCertification.updateSkillAndCertification));
userRoutes.delete('/skill-certification/:skill_certification_id', api.http(skillCertification.removeSkillAndCertification));


userRoutes.post('/document', api.http(documents.addDocument));
userRoutes.put('/document/:document_id', api.http(documents.updateDocument));
userRoutes.delete('/document/:document_id', api.http(documents.removeDocuments));


userRoutes.post('/review/ask-review', api.http(review.askForReview));
userRoutes.post('/review/write-review', api.http(review.submitReview));
userRoutes.put('/review/:id', api.http(review.removePublic));
userRoutes.delete('/review/:id', api.http(review.removeReview));


/** get user profile from user_id */
userRoutes.get('/:user_id', api.http(profile.getProfile));

export default userRoutes;
