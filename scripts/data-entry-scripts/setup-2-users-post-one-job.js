import request from "request-promise";
import {BASE_URL} from "./const";


request({
    method: 'POST',
    uri: BASE_URL + "users/send-otp",
    body: {
        mobile_no: "1111111111",
        roles: "employer",
    },
    json: true
}).then(parsedBody => {
    return request({
        method: 'POST',
        uri: BASE_URL + "users/confirm-otp",
        body: {
            mobile_no: "1111111111",
            otp: "1234",
            roles: "employer",
            name: "CHIRAG",
        },
        json: true
    });
}).then(res => {
    let token = res.data.token;
    request({
        method: 'POST',
        uri: BASE_URL + 'jobs',
        headers: {
            'Authorization': `JWT ${token}`
        },
        body: {
            type: "full_time",
            city: "Delhi",
            description: "this is sample job made from script, for test purpose.",
            category: "others",
            compensation: "compensation",
            cover_pic_url: "https://s3.ap-south-1.amazonaws.com/app-util-images/construction.png",
        },
        json: true
    })
});


request({
    method: 'POST',
    uri: BASE_URL + "users/send-otp",
    body: {
        mobile_no: "2222222222",
        roles: "employee",
    },
    json: true
}).then(parsedBody => {
    return request({
        method: 'POST',
        uri: BASE_URL + "users/confirm-otp",
        body: {
            mobile_no: "2222222222",
            otp: "1234",
            roles: "employee",
            name: "KARTIK",
        },
        json: true
    });
})