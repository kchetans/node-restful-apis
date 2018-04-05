global.Promise = require('bluebird');
global._ = require('lodash');
import JobApplicationSchema from "../../src/mongo-models/JobApplicationSchema";
import UsersProfileSchema from "../../src/mongo-models/UsersProfileSchema";
import Mongoose from "../../src/mongo-models";


Mongoose.init()
    .then(() => {
        return UsersProfileSchema.find({});
    })
    .then((userProfiles) => {
        _.map(userProfiles, (user, index) => {
            JobApplicationSchema.update({user_id: user._id}, {$set: {user_profile: user}}, {multi: true}).exec();
        });
    })
    .then(result => console.log("result => ", result))
    .catch(err => console.log("err", err));
