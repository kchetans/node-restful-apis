/**
 * Created by Kartik Agarwal.
 */
import bodyParser from "body-parser";
import errorHandler from "../middleware/error-handler";
import master from "./master";
import upload from "./upload";
import workexNow from "./workexnow";
//modules index file

// import uploader from "./uploader"
// import formBuilder  from './form-builder';
// import orgStructure from './orgs-structure';
// import ticketSystem from './ticket-system';

let routes = require('express').Router();

/**
 * This is used to register all base apth for each modules
 * when ever you create a new module then add route.use in this file
 */
routes.use(bodyParser.json({limit: '3mb'}));
// parse application/x-www-form-urlencoded
routes.use(bodyParser.urlencoded({extended: true, limit: '5mb'}));


routes.use('/workexnow/v1/', workexNow);
routes.use('/master', master);
routes.use('/upload', upload);

// API error handling
routes.use(errorHandler.resourceNotFound);
routes.use(errorHandler.handleJSONResponse);

export default routes;
