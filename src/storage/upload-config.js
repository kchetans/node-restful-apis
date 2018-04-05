/**
 * Created by anand on 27/10/15.
 */

const mime = require('mime');
const path = require('path');
const chalk = require('chalk');
const multer = require('multer');
const Promise = require('bluebird');
const mkdirp = Promise.promisify(require('mkdirp'));

const errors = require('../errors');
const localStore = require('./local-file-store');

/** list of extensions to be accepted for bike image */
const allowedExt = [
    "jpg",
    "jpeg",
    "gif",
    "png",
    "svg",
    "svgz",
    "bin"
];

let storageOpts = multer.diskStorage({

    destination: function (req, file, cb) {
        /** Absolute path. Folder must exist, will not be created for you. */
        let botID = req.params.botID;
        let userID = req.user._id.toString();

        return localStore.getTargetDir(userID, botID).then((baseDIR) => {
            /** create the directory if not exists */
            return localStore.mkdirp(baseDIR).then(() => {
                file.dir = baseDIR;
                return Promise.resolve(baseDIR);
            });
        }).catch(function (error) {
            throw new errors.ChatteronError({message: 'Error in creating directory.' + error});
        }).asCallback(cb);
    },

    /** set name of the file here */
    filename: function (req, file, cb) {
        let ext = mime.extension(file.mimetype);
        return localStore.generateUniqueFileName(file.dir, ext).catch((error) => {
            console.log(chalk.red(error));
            /** some error occurred. use fall back of current time as file name */
            return Promise.resolve(Date.now() + '.' + ext);
        }).asCallback(cb);
    }
});

let options = {
    storage: storageOpts,

    /**
     * The function should call `cb` with a boolean to indicate if the file should be accepted
     */
    fileFilter: function (req, file, cb) {
        let fileExtension = mime.extension(file.mimetype);

        /** check for acceptable mime types */
        if (allowedExt.indexOf(fileExtension) !== -1) {
            cb(null, true);
        } else {
            /** reject this file pass false */
            cb(new errors.BadRequestError("File type unsupported"), false);
        }
    },

    limits: {
        // for field name of the file (in bytes)
        // 400 bytes in UTF-8 (8-32 bits) can have min 100 chars
        fieldNameSize: 400,
        // use default value i.e. 1 MB = 1048576 bytes
        fieldSize: 1048576,
        // max file size in bytes. 20 MB = 20971520 bytes
        fileSize: 20971520
    }
};

const multerOptions = multer(options);

module.exports = {
    multerOptions: multerOptions
};
