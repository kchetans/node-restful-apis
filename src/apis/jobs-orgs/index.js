// /**
//  * Created By KARTIK AGARWAL
//  * on 9 June, 2017
//  */
// const router = require('express').Router();
// import orgApi from "./org";
// import api from "_includes/api";
// import auth from "../../../middleware/auth";
//
// const authenticateEmployer = [
//     auth.authenticate.authenticateEmployer
// ];
//
// const authenticateUser = [
//     auth.authenticate.authenticateUser
// ];
//
// const authenticateEmployee = [
//     auth.authenticate.authenticateEmployee
// ];
//
//
// /**
//  * Org On boarding APIs
//  */
// router.get('/check-orgs-code/:org_code?', api.http(orgApi.checkOrgCode));
// router.post('/', authenticateUser, authenticateEmployer, api.http(orgApi.createOrg));
// router.get('/:org_code', api.http(orgApi.getOrg));
// router.put('/:org_code', api.http(orgApi.updateOrg));
// router.put('/:org_code/:type', api.http(orgApi.addOptionsToFields));
// router.get('/:org_code/:type', api.http(orgApi.getOptionsToFields));
// // router.post('/orgs/login', api.http(orgApi.getOrgLogin));
//
// export default router;