import _ from "lodash";
import chalk from "chalk";
import config from "config";
import apiMail from "../apis/mail";
let errors = require("../errors");
let hideStack = config.get("hideStack");
const internals = {};
const errorHandler = {};

/**
 * Get an error ready to be shown the the user
 *
 * @TODO: support multiple errors
 * @TODO: decouple req.err
 */
internals.prepareError = function prepareError(err, req, res, next) {

    console.log(chalk.red('ERROR MESSAGE => ', err.message));
    console.log("err", err);

    // In case of a Error class, use it's data
    // Otherwise try to identify the type of error (mongoose validation, mongodb unique, ...)
    // If we can't identify it, respond with a generic 500 error
    // TODO
    if (!(err instanceof errors.CustomError)) {
        // We need a special case for 404 errors
        if (err.statusCode && err.statusCode === 404) {
            err = new errors.NotFoundError({err: err});
        } else {
            try {
                err = new errors.CustomError({err: err, statusCode: err.statusCode});
            } catch (errs) {
                console.log(chalk.red("!!!!!!!!!WTF!!!!!!!!!!!!"), err);
                err = new errors.ValidationError({message: "Something went wrong"});
            }
        }
        /* Send Mail to ids*/
        apiMail.sendServeCrashMail(err.message, err);
    }

    if (!err || err.statusCode >= 500) {
        // Try to identify the error...
        // ...
        // Otherwise create an InternalServerError and use it
        // we don't want to leak anything, just a generic error message
        // Use it also in case of identified errors but with httpCode === 500
        err = new errors.CustomError({err: err});
    }

    // Handle validation errors
    // Todo add multiple error messages for validation error
    if (err.name === 'ValidationError') {
        // responseErr = new errors.BadRequestError({message: err.message}); // TODO standard message? translate?
        // jsonRes.errors = _.map(err.errors, (mongooseErr) => {
        //     return {
        //         message: mongooseErr.message,
        //         path   : mongooseErr.path,
        //         value  : mongooseErr.value,
        //     };
        // });
    }

    // used for express logging middleware see core/server/app.js
    req.err = err;

    // alternative for res.status();
    res.statusCode = err.statusCode;

    // never cache errors
    res.set({
        'Cache-Control': 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'
    });

    next(err);
};

internals.JSONErrorRenderer = function JSONErrorRenderer(err, req, res, /*jshint unused:false */ next) {
    // Create json response for the error
    let jsonRes = {};

    try {

        /* Attach multiple errors to the response*/
        if (!err.errors) {
            jsonRes.errors = [{
                stack: hideStack ? undefined : err.stack,
                code: err.code,
                errorType: err.errorType,
                message: err.message,
                errorDetails: err.errorDetails
            }];
        } else {
            // todo this case never comes up. fix this
            jsonRes.errors = _.map(err.errors, (errorItem) => {
                return {
                    stack: hideStack ? undefined : errorItem.stack,
                    code: errorItem.code,
                    errorType: errorItem.errorType,
                    message: errorItem.message,
                    errorDetails: errorItem.errorDetails
                }
            });
        }
    } catch (err) {
        jsonRes.errors = {
            code: 200,
            message: "Something was terribly wrong.",
        };
    }
    res.json(jsonRes);
};

errorHandler.resourceNotFound = function resourceNotFound(req, res, next) {
    // TODO, handle unknown resources & methods differently, so that we can also produce
    // 405 Method Not Allowed
    next(new errors.NotFoundError({message: "Resource not found"}));
};

errorHandler.handleJSONResponse = [
    // Make sure the error can be served
    internals.prepareError,
    // Render the error using JSON format
    internals.JSONErrorRenderer
];

export default errorHandler
