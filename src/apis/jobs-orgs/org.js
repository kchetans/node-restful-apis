// /**
//  * Created By KARTIK AGARWAL
//  * on 5 Jun 2017
//  */
// import OrganisationSchema from "../../../mongo-models/OrganisationSchema";
// import UsersProfileSchema from "../../../mongo-models/UsersProfileSchema";
// import BranchesSchema from "../../../mongo-models/BranchesSchema";
// import ManagementProfileSchema from "../../../mongo-models/ManagementProfileSchema";
// import CoursesOfferedSchema from "../../../mongo-models/CoursesOfferedSchema";
// import ServiceAndOfferingSchema from "../../../mongo-models/ServiceAndOfferingSchema";
// import FacultyProfileSchema from "../../../mongo-models/FacultyProfileSchema";
// import CentersSchema from "../../../mongo-models/CentersSchema";
// import userLib from "../users/user-lib";
// import {getOrgCode, generateOrgCode} from "./utils";
// let errors = require("../../../errors");
// let config = require('config');
// let hostUrl = config.get('url');
//
// let obj = {
//
//     /**
//      * Create orgs
//      * @param object
//      * @param options
//      * @returns {{data: (Promise|Promise.<this|Errors.ValidationError>|*|{}|{query, params, before_hook, after_hook}), message: string}}
//      */
//     async createOrg(object, options) {
//         let {user} = options;
//         /**
//          * contact_details, registered_person are required by mobile apis
//          */
//         let {contact_details, registered_person, org_logo_url, org_name, org_code, org_type, on_boarding_completed} = object;
//
//         if (!org_name)
//             throw  new errors.ValidationError({message: "org_name is required"});
//
//         if (!org_code)
//             org_code = generateOrgCode(org_name);
//
//         let isOrgCodeExist = await OrganisationSchema.checkOrgCode(org_code);
//
//         if (isOrgCodeExist)
//             throw  new errors.ValidationError({message: "Code is all ready exist"});
//
//         let org = await new OrganisationSchema({
//             org_logo_url, org_name, org_code, org_type, contact_details, registered_person
//         }).save(user);
//
//         user.org_code = org_code;
//         user.org_id = org._id;
//         user.save();
//
//         let user_profile = undefined;
//         if (registered_person)
//             await userLib.updateOrCreateProfile(registered_person, options);
//
//
//         if (on_boarding_completed) {
//             await UsersProfileSchema.update({user_id: user._id}, {
//                 $set: {
//                     on_boarding_er: {
//                         is_completed: true,
//                         last_level: 0
//                     }
//                 }
//             });
//         }
//
//         return {
//             data: {org, user_profile},
//             message: "Organisation Created"
//         };
//
//     },
//
//     /**
//      * Get orgs info form code
//      * @param object
//      * @param options
//      * @returns {{data: (Query|Promise|*), message: string}}
//      */
//     async getOrg(object, options) {
//         let {params} = options;
//         let {org_code} = params;
//         let org = await OrganisationSchema.findOrFail({org_code});
//         return {
//             data: org,
//             message: "Organisation fetched successfully"
//         };
//     },
//
//     /**
//      * Check orgs code is exist or not
//      * @param object
//      * @param options
//      * @returns {*}
//      */
//     async checkOrgCode(object, options) {
//         let {params} = options;
//         let {org_code} = params;
//
//         let isOrgCodeExist = await OrganisationSchema.checkOrgCode(org_code);
//         if (isOrgCodeExist)
//             return {
//                 data: isOrgCodeExist,
//                 message: "Code All Ready Exist"
//             };
//         else
//             return {
//                 data: isOrgCodeExist,
//                 message: "Code not Exist"
//             };
//     },
//
//     async updateOrg(object, options) {
//         let org_code = options.params.org_code;
//         let currentOrg = await OrganisationSchema.findOrFail({org_code});
//         let {key, data} =  object;
//
//         if (!data)
//             throw  new errors.ValidationError({message: "data field is required"});
//
//         let {
//             facebook_page, twitter_handle, instagram_page, blog_url, linkedin_url,
//             about_company, line_of_businesses, no_of_employees, no_of_clients, no_of_courses, no_of_facility,
//             accreditations, date_of_incorporation, cin_no,
//             web_site_url, phone_no, email, geoLocation, head_office_address, address_line_2, country, pin_code,
//             state, city,
//             name, designation, mobile_no, password
//         } = data;
//         switch (key) {
//             case "social_profiles":
//                 currentOrg[key] = {facebook_page, twitter_handle, instagram_page, blog_url, linkedin_url};
//                 break;
//             case "about_company":
//                 currentOrg[key] = {
//                     about_company, line_of_businesses, no_of_employees, no_of_clients,
//                     no_of_courses, no_of_facility, accreditations, date_of_incorporation, cin_no
//                 };
//                 break;
//             case "contact_details" :
//                 currentOrg[key] = {
//                     web_site_url, phone_no, email, geoLocation, head_office_address, address_line_2, country, pin_code,
//                     state, city
//                 };
//                 break;
//             case "registered_person":
//                 currentOrg[key] = {name, designation, mobile_no, email, password};
//                 break;
//             case "industries_served":
//                 currentOrg[key] = data.industries_served;
//                 break;
//             default:
//                 throw  new errors.ValidationError({message: "key is required and should be valid"});
//         }
//
//         return {
//             data: await currentOrg.save(),
//             message: "orgs updated successfully"
//         }
//
//     },
//
//     async getOptionsToFields(object, {params}){
//         let {org_code, type} = params;
//
//         // let organisation = await OrganisationSchema.findOrFail({org_code});
//         let info = {};
//         switch (type) {
//             case 'branches':
//                 info = await BranchesSchema.find({org_code});
//                 break;
//             default :
//                 throw  new errors.ValidationError({message: "type is required and should be valid"});
//         }
//
//         return {
//             data: info,
//             message: `${type} added successfully`
//         }
//
//     },
//
//     async addOptionsToFields(object, {params}){
//         let {org_code, type} = params;
//
//         let organisation = await OrganisationSchema.findOrFail({org_code});
//
//         let info = {};
//         let {
//             branch_name, name, designation,
//             phone_no, email, address, pincode, city, state, about,
//             service_type, service_name, about_service, benefits_for_customers,
//             service_geographies, brochure_urls, course_name, about_course,
//             course_industry, course_fees, course_duration, course_geographies,
//             specialization, center, title, center_name, country
//         } = object;
//
//         switch (type) {
//             case 'branches':
//                 info = await new BranchesSchema({
//                     org: organisation, org_code, branch_name, name, designation,
//                     phone_no, email, address, pincode, city, state, country
//                 }).save();
//                 break;
//             case 'management_profile':
//                 info = await  new ManagementProfileSchema({
//                     org: organisation, org_code, name, designation, phone_no, email, about
//                 }).save();
//                 break;
//             case 'service_offering':
//                 info = await new ServiceAndOfferingSchema({
//                     org: organisation, org_code, service_type,
//                     service_name, about_service, benefits_for_customers, service_geographies,
//                     brochure_urls
//                 }).save();
//                 break;
//             case 'courses_offered':
//                 info = await new CoursesOfferedSchema({
//                     org: organisation, org_code, course_name, about_course, course_industry,
//                     course_fees, course_duration, course_geographies, brochure_urls
//                 }).save();
//                 break;
//             case 'faculty_profile':
//                 info = await new FacultyProfileSchema({
//                     org: organisation, org_code, name, center, title, about, specialization
//                 }).save();
//                 break;
//             case 'centers':
//                 info = await new CentersSchema({
//                     org: organisation,
//                     org_code,
//                     phone_no, email,
//                     designation,
//                     name, center_name,
//                     address, pincode, city, state, country
//                 }).save();
//                 break;
//             default :
//                 throw  new errors.ValidationError({message: "type is required and should be valid"});
//         }
//
//         return {
//             data: info,
//             message: `${type} added successfully`
//         }
//
//     },
// };
//
// export default obj;
