const auth = require('express').Router();
import analyticsApi from "./apis";
import chartDs from "./chartDs";
let api = require('_includes').api;

/*********** MOBILE APIS ***********/
// auth.get('/1/:chartCode', api.http(chartDs.get1));
// auth.get('/2/:chartCode', api.http(chartDs.get2));
// auth.get('/3/:chartCode', api.http(chartDs.get3));
// auth.get('/4/:chartCode', api.http(chartDs.get4));
// auth.get('/5/:chartCode', api.http(chartDs.get5));

/**
 * You can also write in this way
 * but no middleware support will be provided
 */
auth.get('/', (req, res) => {
    res.statusCode = 200;
    res.send("ok");
});

export default auth;
