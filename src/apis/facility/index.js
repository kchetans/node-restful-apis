const FacilityRoutes = require('express').Router();
// import configs from "./configs";
import facilityApi from "./api";
var api = require('_includes').api;

/** Feeds API **/
// FeederRoutes.get('/', api.http(facilityApi.getView));
// FacilityRoutes.get('/facilities', api.http(facilityApi.getFacilities));
FacilityRoutes.get('/', api.http(facilityApi.getAllFacilities));
FacilityRoutes.post('/', api.http(facilityApi.createFacility));
FacilityRoutes.get('/getfacilitybyid', api.http(facilityApi.getFacilityByID));


// FeederRoutes.post('/feeds/:userID', api.http(feederApi.postFeeds));

/**
 * You can also write in this way
 * but no middleware support will be provided
 */
FacilityRoutes.get('/', (req, res) => {
    res.statusCode = 200;
    res.send("ok");
});

export default FacilityRoutes;
