/**
 * Create employees and send them to hire stage
 * @type {number}
 */
import request from "request-promise";
import _ from "lodash";
import {BASE_URL} from "./const";
import EmployerData from "./users/employer.json";
import {JOB_CATEGORY_IMAGES} from "../src/constants/application";

let noOfEmployer = EmployerData.length;

let global_job_type = ["full_time", "part_time"];

let global_categories = [
    {
        "value": "barista_bartender",
        "key": "Barista & Bartender"
    },
    {
        "value": "beauty_Wellness",
        "key": "Beauty & Wellness"
    },
    {
        "value": "careworkers_health",
        "key": "Careworkers & Health"
    },
    {
        "value": "chef_cook",
        "key": "Chef & Cook"
    },
    {
        "value": "cleaner",
        "key": "Cleaner"
    },
    {
        "value": "construction",
        "key": "Construction"
    },
    {
        "value": "driver_courier",
        "key": "Driver & Courier"
    },
    {
        "value": "education",
        "key": "Education"
    },
    {
        "value": "events_promotion",
        "key": "Events & Promotion"
    },
    {
        "value": "kitchen_porter",
        "key": "Kitchen Porter"
    },
    {
        "value": "office_admin",
        "key": "Office & Admin"
    },
    {
        "value": "retail",
        "key": "Retail"
    },
    {
        "value": "sales_marketing",
        "key": "Sales & Marketing"
    },
    {
        "value": "waiter_waitress",
        "key": "Waiter / Waitress"
    },
    {
        "value": "warehouse",
        "key": "Warehouse"
    },
    {
        "value": "Others",
        "key": "Others"
    }
];

for (let i = 0; i < 143; i++) {
    let {name, mobile_no} = EmployerData[i];
    mobile_no = 1000000000 + i;
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
                roles: "employer",
                name: name,
            },
            json: true
        })
    }).then(res => {
        let token = res.data.token;
        let ftJobsPromiseArray = [];
        for (let j = i * 10; j < (i + 1) * 10; j++) {
            let {name, mobile_no, description, city, compensation, title} = EmployerData[j];
            let category = global_categories[_.random(0, global_categories.length)];
            let images = JOB_CATEGORY_IMAGES[category.value];
            if (description.length < 50)
                description = description + description + description;
            if (description.length < 50)
                description = description + description + description + description + description + description;
            ftJobsPromiseArray.push(request({
                method: 'POST',
                uri: BASE_URL + 'jobs',
                headers: {
                    'Authorization': `JWT ${token}`
                },
                body: {
                    type: global_job_type[_.random(0, global_job_type.length - 1)],
                    description, city, compensation, title, category,
                    cover_pic_url: images [_.random(0, images.length - 1)],
                },
                json: true
            }));
        }
        return Promise.all(ftJobsPromiseArray);
    }).then(res => {
        console.log("res", res);
    }).catch(err => {
        console.error(`${i} =>`, err)
    })
}