global.Promise = require('bluebird');
global._ = require('lodash');
import JobPostingSchema from "../../src/mongo-models/JobPostingSchema";
import ConfigDataManager from "../../src/data-manager/Configs";
import Mongoose from "../../src/mongo-models";


Mongoose.init()
    .then(() => {
        return JobPostingSchema.find({});
    })
    .then((jobs) => {
        let categories = ConfigDataManager.getJobCategory();
        _.map(jobs, (job, index) => {
            let jobcat = job.categor;
        });
    })
    .then(result => console.log("result => ", result))
    .catch(err => console.log("err", err));
