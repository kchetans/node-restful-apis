global.Promise = require('bluebird');
global._ = require('lodash');
import JobApplicationSchema from "../../src/mongo-models/JobApplicationSchema";
import Mongoose from "../../src/mongo-models";


Mongoose.init()
    .then(() => {
        return JobApplicationSchema.find({});
    })
    .then((jobApplications) => {
        _.map(jobApplications, (jobApplication, index) => {
            jobApplication.save();
        });
    })
    .then(result => console.log("result => ", result))
    .catch(err => console.log("err", err));
