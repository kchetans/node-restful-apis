global.Promise = require('bluebird');
global._ = require('lodash');
import UsersProfileSchema from "../../src/mongo-models/UsersProfileSchema";
import Mongoose from "../../src/mongo-models";


Mongoose.init()
    .then(() => {
        return UsersProfileSchema.find({});
    })
    .then((users) => {
        _.map(users, (user, index) => {
            UsersProfileSchema.updatePercentage(user._id);
        });
    })
    .then(result => console.log("result => ", result))
    .catch(err => console.log("err", err));
