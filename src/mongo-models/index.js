let fs = require("fs");
let mongoose = require("mongoose");
let config = require("config");
// use bluebird promise for mongoose promises
mongoose.Promise = Promise;

let mongoConfig = config.get("database").mongo;

/**
 * Show mongo logs
 */
let {logging = true} = mongoConfig;
mongoose.set('debug', logging);

/** Expose all models */
exports = module.exports;

exports.init = function init() {
    let connectionUrl;

    /** Connect with the database here */

    let {user, host, schema: database, password, logging = true, params} = mongoConfig;
    connectionUrl = `mongodb://`;
    if (user && password)
        connectionUrl += `${user}:${password}@`;
    connectionUrl += `${host}/${database}`;
    if (params)
        connectionUrl += `?${params}`;

    console.log("connectionUrl", connectionUrl);

    const timeout = 5 * 60 * 1000;

    const mongooseOptions = {
        useMongoClient: true,
        // db: {native_parser: true},
        server: {
            // default pool size is 5
            poolSize: 5,
            socketOptions: {keepAlive: 120, connectTimeoutMS: timeout}
        },
        //NOTE : replset is required, as we can encouter ERROR =>  Topology was destroyed
        replset: {socketOptions: {keepAlive: 120, connectTimeoutMS: timeout}},
    };


    return new Promise((resolve, reject) => {
        /** Connect with the database here */
        mongoose.connect(connectionUrl, mongooseOptions)
            .then(res => {
                // pre-load all models
                fs.readdirSync(__dirname).filter((file) => {
                    return (file.indexOf(".") > 0) && (file !== "index.js");
                }).forEach((name) => {
                    _.extend(module.exports, require('./' + name));
                });
                resolve(true)
            })
            .catch(err => reject(err));
    });
};

// expose mongoose connection object
module.exports.mongoose = mongoose;
