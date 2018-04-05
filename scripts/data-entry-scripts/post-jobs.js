import request from "request-promise";
import {BASE_URL} from "./const";
import {jobs_data} from "./jobs-data";


for (let i = 0; i < jobs_data.length; i++) {
    //Create user
    request({
        method: 'POST',
        uri: BASE_URL + "users/send-otp",
        body: {
            mobile_no: `000000000${i}`,
            password: `000000000${i}`
        },
        json: true
    }).then(parsedBody => {
        console.log(`${i} =>`, parsedBody)
    }).catch(err=> {
        console.error(`${i} =>`, err)
    })
}



