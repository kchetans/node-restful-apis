global.Promise = require('bluebird');
global._ = require('lodash');
global.moment = require('moment');
import {init as elastic} from "../../src/elastic-search";
import JobPostingSchema from "../../src/mongo-models/JobPostingSchema";
import Mongoose from "../../src/mongo-models";

import mappingJson from "./mappings/JobPosting.json";

let elasticClient = elastic({
    log: undefined
});

console.log("*********************PROCESS STARTED*****************************");

let indexName = "job_postingss";

let deleteIndex = (indexName) => {
    return new Promise((resolve, reject) => {
        elasticClient.indices.delete({
            index: indexName
        }).then(res => {
            resolve(res)
        }).catch(err => {
            resolve(err);
        });
    })
};

deleteIndex(indexName)
    .tap(res => {
        console.log("*********************MAPPING DELETED*****************************");
        return elasticClient.indices.create({
            index: indexName,
            body: mappingJson
        });
    }).then(res => {
    console.log("*********************MAPPING CREATED*****************************");
}).then(res => {
    return Mongoose.init();
}).then(() => {
    console.log("*********************MONGO CONNECTED*****************************");
    return new Promise((resolve, reject) => {
        let stream = JobPostingSchema.synchronize();
        let count = 0;
        let startTime = new moment(new Date());

        stream.on('data', function (err, doc) {
            count++;
        });

        stream.on('close', () => {
            resolve(moment.duration(new moment(new Date()).diff(startTime), 'milliseconds').humanize())
        });

        stream.on('error', (err) => {
            reject(err);
        });

    });
})
    .then(result => console.log("result => ", result))
    .catch(err => {
        console.log("*********************ERROR*****************************");
        console.log("err", err)
    });
