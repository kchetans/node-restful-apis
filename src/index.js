/**
 * Created By Kartik Agarwal
 */
//this line must be first line of code, so should be at top
import "babel-polyfill";
import express from "express";
import chalk from "chalk";
import path from "path";
import apis from "./apis";
import {mapp} from "_includes";
import mongoModels from "./mongo-models";
import redisModule from "./redis-module";
import {init as elasticSearch} from "./elastic-search";
import pushNotification from "./push-notification";
import authMiddleware from "./middleware/auth";
import logRequest from "./middleware/log-request";
import {init as cronJobs} from "./crons";
import requestSource from "./middleware/request-source";
import WorkexServer from "./WorkexServer";
import siteRouter from "./site";
import elasticIndices from "./elastic-search/indeces";
global.Promise = require('bluebird');
global._ = require('lodash');
global.moment = require('moment');
const co = Promise.coroutine;
let debug = require('debug')('workex:boot:init');
let parentApp = mapp;

moment.updateLocale('en', {
    relativeTime: {
        future: "In %s",
        past: "%s AGO",
        s: 'A FEW SECONDS',
        ss: '%d SECONDS',
        m: "A MINUTE",
        mm: "%d MINUTES",
        h: "AN HOUR",
        hh: "%d HOURS",
        d: "A DAY",
        dd: "%d DAYS",
        M: "A MONTH",
        MM: "%d MONTHS",
        y: "A YEAR",
        yy: "%d YEARS"
    }
});

let init = co(function*() {
    console.log(chalk.green.bold(`Serving is starting. Have some 🍺`));

    debug('Init Start...');

    let workexServer = mapp;

    /** TODO Initialize i18n**/

    console.log(chalk.blue("Model Initialising..."));

    try {
        yield mongoModels.init();
        yield authMiddleware.init();
        yield pushNotification.init();
        yield redisModule.init();
        yield cronJobs();
        elasticSearch();
    } catch (err) {
        console.log("err => ", err);
    }


    parentApp.use(requestSource);
    parentApp.use(logRequest);
    console.log(chalk.blue("API Initialising..."));
    parentApp.get('/elastic', elasticIndices.indexData);
    parentApp.use('/api/', apis);

    parentApp.use('/pub', siteRouter);

    console.log(chalk.green(`  ✅ API Initialising Done`));

    workexServer = new WorkexServer(parentApp);
    debug('...Init End');
    debug('Starting Server...');

    //static file
    parentApp.use('/public', express.static(path.join(__dirname, '../static')));
    parentApp.use('/public/images', express.static(path.join(__dirname, '../uploads')));

    parentApp.get('/', function (req, res) {
        res.send({message: `Your app is running successfully in ${process.env.NODE_ENV} - ${new Date()}`});
    });


    // Let Ghost handle starting our server instance.
    return workexServer.start(parentApp);
});

init();

module.exports = parentApp;