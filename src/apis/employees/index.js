
const auth = require('express').Router();
import admin from "./admin";
var api = require('_includes').api;

auth.post('/', api.http(admin.getAllEmployees));
auth.get('/', api.http(admin.handleAllEmployees));
auth.get('/summary', api.http(admin.getSummary));
auth.get('/getactiveemp/', api.http(admin.GetActiveEmployeeByEmpcode));
auth.get('/getempbyempid/', api.http(admin.GetEmployeeByEmpId));
auth.post('/create_new', api.http(admin.createNewEmployee));
auth.post('/create_ga', api.http(admin.createGA));
auth.post('/create_leaver', api.http(admin.createLeaver));

/**
 * You can also write in this way
 * but no middleware support will be provided
 */
auth.get('/', (req, res) => {
    res.statusCode = 200;
    res.send("ok");
});

export default auth;
