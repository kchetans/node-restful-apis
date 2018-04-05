const leavesRouter = require('express').Router();
import leave from "./api";
var api = require('_includes').api;


leavesRouter.post('/leaveRequest', api.http(leave.leaveRequest));
leavesRouter.post('/pageconfig', api.http(leave.pageConfig));


export default leavesRouter;
