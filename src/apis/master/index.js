const master = require('express').Router();
let api = require('_includes').api;
import master_svc from "./admin";
import staticMaster from "./static-master";
import masterApis from "./master-apis";
// import login_config from "./login-config";
// let menu_store = require('_includes/cassandra/modules/menus')

master.get('/:table/:text_field/:value_field/', api.http(master_svc.fetchMaster));

master.get('/sa/', api.http(master_svc.fetchSAMaster));
master.get('/positions/', api.http(master_svc.positionsMaster));
master.get('/facilities/', api.http(master_svc.facilitiesMaster));
master.get('/facility_types/', api.http(master_svc.facilityTypesMaster));

// master.get('/', api.http(facilityApi.getAllFacilities));

/**
 * Static Masters
 */
master.get('/designation', api.http(staticMaster.getDesignation));
master.get('/edu-degree', api.http(staticMaster.getEducationDegree));
master.get('/educations', api.http(staticMaster.getEducation));
master.get('/city', api.http(staticMaster.getCities));
master.get('/cities', api.http(staticMaster.getAllCities));
master.get('/place', api.http(staticMaster.getPlaceFromGooglePlacesApis));
master.get('/state', api.http(staticMaster.getStates));
master.get('/job-categories', api.http(staticMaster.getJobCategoryData));
master.get('/country', api.http(staticMaster.getCountries));
master.get('/languages', api.http(staticMaster.getLanguages));
master.get('/pincode/:pincode', api.http(staticMaster.getInfoFromPinCode));

/**
 * Fetch Master
 */
master.get('/header/:header_code', api.http(masterApis.getDataFromCode));

/**
 * Create Master APIs
 */
/** CSID Table**/
master.post('/csid', api.http(masterApis.createCSID));
master.get('/csid', api.http(masterApis.getCSID));

/** Master Table**/
master.get('/:csid/master', api.http(masterApis.getMaster));
master.post('/:csid/master', api.http(masterApis.createMaster));

/** Master Headers **/
master.get('/:master_id/master-header', api.http(masterApis.getHeader));
master.post('/:master_id/master-header', api.http(masterApis.createHeader));

master.get('/:master_id/master-data/', api.http(masterApis.getData));
master.post('/:master_id/master-data/:row_id', api.http(masterApis.postData));

/** Master Data **/
master.get('/:header_id/header-data', api.http(masterApis.getHeaderData));
master.post('/:header_id/header-data', api.http(masterApis.createData));


export default master;
