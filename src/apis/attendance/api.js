import {fun as attendance} from "attendance/attendance";

var path = require('path');
var api = require('_includes').api;
let includes = require('_includes')
let mdb = includes.mdb;

let attendanceApi = {

async markAttendance(object, options){

let {headers}  = options;
let userID     = headers["wx-user-token"];
let act = await attendance.markAttendance(object)
return act

},

async dayWise(object, options){

let {employee_id,start_date,end_date}  = options.query;
let act = await attendance.dayWise({employee_id,start_date,end_date})
return act[0]

},

async summary(object, options){

let {employee_id,start_date,end_date}  = options.query;
let act = await attendance.Summary({employee_id,start_date,end_date})
return act[0]

},

async hourlysummary(object, options){
let {employee_id,start_date,end_date}  = options.query;
let act = await attendance.hourlySummary({employee_id,start_date,end_date})
return act

},


async pageConfig(object, options){
  let {le_id} = options.query;
  let leid=parseInt(le_id)
  return new Promise((resolve, reject) => {
    mdb.collection('attendance_config').findOne({le_id:leid},function (err,docs){
        if(err){
        reject(err);
        }
        else{
          resolve(docs);
        }
      });
  });

},


}

export default attendanceApi
