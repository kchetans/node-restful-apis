const auth = require('express').Router();
import admin from "./admin";
var api = require('_includes').api;

auth.get('/', api.http(admin.getAllExits));
auth.get('/approve', api.http(admin.ApproveExit));
auth.get('/reject', api.http(admin.RejectExit));

/**
 * You can also write in this way
 * but no middleware support will be provided
 */
auth.get('/', (req, res) => {
    res.statusCode = 200;
    res.send("ok");
});

export default auth;
