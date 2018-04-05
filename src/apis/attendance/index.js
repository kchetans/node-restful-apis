const attendanceRouter = require('express').Router();
import attendance from "./api";
var api = require('_includes').api;


attendanceRouter.post('/markattendance', api.http(attendance.markAttendance));
attendanceRouter.get('/pageconfig', api.http(attendance.pageConfig));
attendanceRouter.get('/daywise', api.http(attendance.dayWise));
attendanceRouter.get('/summary', api.http(attendance.summary));
attendanceRouter.get('/hourlysummary', api.http(attendance.hourlysummary));


export default attendanceRouter;
