const auth = require('express').Router();
import admin from "./admin";
import orgStr from "./org-str";
import tables from "./tables";
let api = require('_includes').api;

auth.get('/', api.http(admin.getAllOrganisations));
auth.post('/create_new', api.http(admin.createOrganisation));

auth.get('/entityTypes' , api.http(tables.getEntityTypes));

/** ORG Structure **/
auth.get('/str/', api.http(orgStr.orgStruc));
auth.post('/str/bu', api.http(orgStr.createBU));
auth.post('/str/position', api.http(orgStr.createPosition));

/**
 * You can also write in this way
 * but no middleware support will be provided
 */
auth.get('/', (req, res) => {
    res.statusCode = 200;
    res.send("ok");
});

export default auth;
