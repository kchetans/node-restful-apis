// base schema class for all mongoose documents. Specify common properties and methods here.
// All other schema shall extend this class as the base class.
import mongoose from "mongoose";
import * as errors from "../../errors";
import chalk from "chalk";
/**
 *  TODO
 *  Custom validation for nested sub-document fails with infinite recursion right now.
 *  Check if this issue is fixed in the next release of mongoose
 */
// import {v4 as uuid} from 'uuid'/
// import validator from 'validator'

export default function baseModel(schema, options = {}) {
    if (options._id !== false) {
        // schema.add({
        //     _id: {
        //         type    : String,
        //         default : uuid,
        //         validate: [validator.isUUID, 'Invalid uuid.'],
        //     },
        // });
    }

    let withTimestamps = !options.timestamps;
    let withCreateUpdateUser = !options.createUpdateUser;
    if (withTimestamps) {
        schema.add({
            created_at: {
                type: Date,
                default: Date.now,
            },
            updated_at: {
                type: Date,
                default: Date.now,
            },
        });
    }

    if (withCreateUpdateUser) {
        schema.add({
            created_by: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user_profiles',
            },
            updated_by: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user_profiles',
            }
        });
    }

    if (withTimestamps) {
        schema.pre('save', function updateUpdatedAt(next) {
            if (!this.isNew) {
                console.log("in prev save updated_at will be inserted Or updated");
            } else {
                console.log("in prev save updated_at will *NOT* be inserted Or updated");
            }
            if (!this.isNew) this.updated_at = Date.now();
            else this.created_at = Date.now();
            next();
        });
    }

    if (withCreateUpdateUser) {
        schema.pre('save', function updateUpdatedAt(next, user) {
            if (!this.isNew) {
                console.log("in prev save created_by will be inserted Or updated");
            } else {
                console.log("in prev save created_by will *NOT* be inserted Or updated");
            }
            if (!user)
                console.log(chalk.yellow("Please try to pass user object from option to save function"));
            if (!this.isNew && user && user._id) this.updated_by = user._id;
            else if (user && user._id) this.created_by = user._id;
            next();
        });
    }

    let noSetFields = ['created_at', 'updated_at'];
    let privateFields = ['__v'];

    if (Array.isArray(options.noSet)) noSetFields.push(...options.noSet);

    // This method accepts an additional array of fields to be sanitized that can be passed at runtime
    schema.statics.sanitize = function sanitize(objToSanitize = {}, additionalFields = []) {
        noSetFields.concat(additionalFields).forEach((fieldPath) => {
            _.unset(objToSanitize, fieldPath);
        });

        // Allow a sanitize transform function to be used
        return options.sanitizeTransform ? options.sanitizeTransform(objToSanitize) : objToSanitize;
    };

    if (Array.isArray(options.private)) privateFields.push(...options.private);

    if (!schema.options.toJSON) schema.options.toJSON = {};

    schema.options.toJSON.transform = function transformToObject(doc, plainObj) {
        privateFields.forEach((fieldPath) => {
            _.unset(plainObj, fieldPath);
        });

        // Always return `id`
        // if (!plainObj.id && plainObj._id) plainObj.id = plainObj._id;

        // Allow an additional toJSON transform function to be used
        return options.toJSONTransform ? options.toJSONTransform(plainObj, doc) : plainObj;
    };

    schema.statics.getModelPaths = function getModelPaths() {
        return _.reduce(this.schema.paths, (result, field, path) => {
            if (privateFields.indexOf(path) === -1) {
                result[path] = field.instance || 'Boolean';
            }
            return result;
        }, {});
    };

    /**
     * base method for find the document or fail with an error
     * @param conditionOrID
     * @param errMsg
     * @return {Query|Promise|*}
     */
    schema.statics.findOrFail = async function (conditionOrID, errMsg) {
        let query, notFoundMsg;
        if (_.isString(conditionOrID)) {
            query = {_id: conditionOrID};
            notFoundMsg = `Resource ${conditionOrID} not found.`;
        } else {
            query = conditionOrID;
            notFoundMsg = `Resource query not found.`;
        }

        let doc = await this.findOne(query);
        let message = errMsg || notFoundMsg;
        if (!doc) throw new errors.NotFoundError({message: message});
        return doc;
    };


    /**
     * base method for find the document or fail with an error
     * @param conditionOrID
     * @param errMsg
     * @return {Query|Promise|*}
     */
    schema.statics.findOneOrFail = async function (conditionOrID, errMsg) {
        let query, notFoundMsg;
        if (_.isString(conditionOrID)) {
            query = {_id: conditionOrID};
            notFoundMsg = `Resource ${conditionOrID} not found.`;
        } else {
            query = conditionOrID;
            notFoundMsg = `Resource not found.`;
        }

        let doc = await this.findOne(query);
        let message = errMsg || notFoundMsg;
        if (!doc) throw new errors.NotFoundError({message: message});
        return doc;
    };

    /**
     * base method for find the document or fail with an error
     * @param conditionOrID
     * @param errMsg
     * @return {Query|Promise|*}
     */
    schema.statics.findAllOrFail = async function (conditionOrID, errMsg) {
        let query, notFoundMsg;
        if (_.isString(conditionOrID)) {
            query = {_id: conditionOrID};
            notFoundMsg = `Resource ${conditionOrID} not found.`;
        } else {
            query = conditionOrID;
            notFoundMsg = `Resource not found.`;
        }

        let doc = await this.find(query);
        let message = errMsg || notFoundMsg;
        if (!doc) throw new errors.NotFoundError({message: message});
        return doc;
    };

    /**
     * Check if the document exists in the database or throw an error
     * @param conditionOrID
     * @param errMsg
     * @return {Promise|Query|*}
     */
    schema.statics.doesExistOrFail = async function (conditionOrID, errMsg) {
        let query, notFoundMsg;
        if (_.isString(conditionOrID)) {
            query = {_id: conditionOrID};
            notFoundMsg = `Resource ${conditionOrID} not found.`;
        } else {
            query = conditionOrID;
            notFoundMsg = `Resource not found.`;
        }

        let count = await this.findOne(query);
        let message = errMsg || notFoundMsg;
        if (count == 0) throw new errors.NotFoundError({message: message});
    };

    /**
     * Try to save document with retries.
     * Useful for handling concurrent edits on the document
     */
    schema.methods.saveRetry = async function () {
        let maxRetries = 20;
        while (maxRetries-- > 0) {
            try {
                await this.save();
                break;
            } catch (err) {
                console.log(Object.keys(err));
            }
        }
    };

};
