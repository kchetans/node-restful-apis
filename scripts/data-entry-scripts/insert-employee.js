/**
 * Create employees and send them to hire stage
 * @type {number}
 */
import request from "request-promise";
import {BASE_URL} from "./const";
import EmployeeData from "./users/employee.json";

let noOfEmployee = EmployeeData.length;

for (let i = 0; i < noOfEmployee; i++) {
    let {name, mobile_no} = EmployeeData[i];
    request({
        method: 'POST',
        uri: BASE_URL + "users/send-otp",
        body: {
            mobile_no: mobile_no,
        },
        json: true
    }).then(parsedBody => {
        return request({
            method: 'POST',
            uri: BASE_URL + "users/confirm-otp",
            body: {
                mobile_no: mobile_no,
                otp: "123456",
                roles: "employee",
                name: name,
            },
            json: true
        })
    }).then(res => {
        console.log("res", res);
    }).catch(err => {
        console.error(`${i} =>`, err)
    })
}



