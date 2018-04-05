import {fun as leave} from "leaves/leaves";

var path = require('path');
var api = require('_includes').api;

let leaveApi = {

async leaveRequest(object, options){
  
let act = await leave.leaveRequest(object)
return act

},

async pageConfig(object, options){
  let {csid} = options.query;
  return new Promise((resolve, reject) => {
    mdb.collection('leave').findOne({csid: csid},function (err,docs){
        if(err){
          console.log('err',err)
        reject(err);
        }
        else{
          resolve(docs);
        }
      });
  });

},


}

export default leaveApi
