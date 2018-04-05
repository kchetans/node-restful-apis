// # Local File System Image Storage module
// The (default) module for storing images, using the local file system

const os = require('os');
const path = require('path');
const util = require('util');
const _ = require('lodash');
const shortid = require('shortid');
const Promise = require('bluebird');
const fs = require('fs-extra');
const pluralize = require('pluralize');
const co = Promise.coroutine;
const serveStatic = require('express').static;

const config = require('config');
const errors = require('../errors');
const globalUtils = require('../utils');
const nodeUtils = require('../utils/util');

const moveAsync = Promise.promisify(fs.move);
const statAsync = Promise.promisify(fs.stat);
const copyAsync = Promise.promisify(fs.copy);
const removeAsync = Promise.promisify(fs.remove);
const readdirAsync = Promise.promisify(fs.readdir);
const mkdirp = Promise.promisify(require('mkdirp'));

/** max no of files allowed inside a directory */
const MAX_FILES = 1000;

/**
 * Return all directories in the @srcpath sorted in descending order by their last modified time
 * @param srcpath
 * @returns {Promise|*|Promise.<TResult>}
 */
function getSortedDirs(srcpath) {
    return readdirAsync(srcpath).map((file) => {
        return statAsync(path.join(srcpath, file)).then((stat) => {
            return {
                name      : file,
                isDir     : stat.isDirectory(),
                modifiedAt: stat.mtime.getTime()
            }
        }).catch((err) => false);
    }).filter((fileObj) => {
        return fileObj && fileObj.isDir;
    }).then((dirArray) => {
        return _.sortBy(dirArray, (dirInfo) => -1 * dirInfo.modifiedAt);
    });
}

class LocalFileStore {

    constructor() {
        this.uploadDir = config.get("paths:uploads");
    }

    /**
     * Base directory where all upload content is stored
     * @returns {*|string|String}
     */
    getBaseDir() {
        return this.uploadDir;
    }

    // Base directory for storing images
    getImagesDir() {
        return path.join(this.uploadDir, 'images');
    }

    // Base directory for storing videos
    getVideoDir() {
        return path.join(this.uploadDir, 'videos');
    }

    // Base directory for storing audio content
    getAudioDir() {
        return path.join(this.uploadDir, 'audios');
    }

    /**
     * get base directory by content type of the upload
     *
     * @param contentType
     */
    getBaseContentDir(contentType) {
        /* name of the directory based on the content type */
        let contentDir;
        if (!nodeUtils.isNullOrUndefined(contentType)) {
            let subparts = contentType.split("/");
            if (subparts.length > 1) contentDir = pluralize.plural(subparts[0]);
        }
        /* use fallback folder in case of unrecognised mime type */
        if (nodeUtils.isNullOrUndefined(contentDir)) contentDir = 'generic';
        contentDir = contentDir.toLowerCase();
        return path.join(this.uploadDir, contentDir);
    }

    /**
     * get target directory to store the content
     *
     * @param contentType
     * @returns {Promise.<TResult>}
     */
    getTargetDir(contentType) {
        let srcdir = this.getBaseContentDir(contentType);
        const self = this;
        // find all directories in the source directory
        return this.mkdirp(srcdir).then(() => getSortedDirs(srcdir)).then(co(function*(dirArray) {
            if (dirArray.length == 0) {
                let dirname = '1';
                let dirPath = path.join(srcdir, dirname);
                yield self.mkdirp(dirPath);
                return dirPath;
            } else {
                /* get last directory and use that or create a new directory if that one has reached capacity */
                let latestDir = dirArray[0].name;
                let latestDirPath = path.join(srcdir, latestDir);
                let filesInLastDir = yield readdirAsync(latestDirPath);

                let isMaxed = filesInLastDir.length >= MAX_FILES;
                /* same directory can be used if not maxed out */
                if (!isMaxed) return latestDirPath;

                /* create a new directory in continuation */
                let nextNo = parseInt(latestDir) + 1;
                let baseName = nextNo.toString();

                let dirPath = path.join(srcdir, baseName);
                yield self.mkdirp(dirPath);
                return dirPath;
            }
        }));
    }

    /**
     * Generate a unique file name within the directory @dir
     * @param dir
     * @param ext
     * @returns {*|Promise|Promise.<TResult>}
     */
    generateUniqueFileName(dir, ext) {
        let uniqueID = shortid.generate();
        let fileName = path.join(dir, uniqueID + ext);

        return this.exists(fileName).then((exists) => {
            return (exists ? this.generateUniqueFileName(dir, ext) : fileName);
        });
    }

    mkdirp(dir, options) {
        options = options || {};
        /*
         * permission for folder.
         * check http://stackoverflow.com/questions/10990/what-are-the-proper-permissions-for-an-upload-folder-with-php-apache
         */
        options.mode = options.mode || '0755';
        return mkdirp(dir, options);
    }

    copy(source, target) {
        return copyAsync(source, target);
    }

    move(source, target) {
        return moveAsync(source, target);
    }

    /**
     * Check if file with name @filename exists or not
     * @param filename
     */
    exists(filename) {
        return statAsync(filename).then((statInfo)=> {
            return true;
        }).catch((err) => false);
    }

    unlink(fileName) {
        let pathToDelete = path.resolve(fileName);
        return removeAsync(pathToDelete);
    }

    /**
     * middleware for serving the files
     * @param options
     * @returns {*}
     */
    serve(options) {
        options = options || {};

        // CASE: serve images
        // For some reason send divides the max age number by 1000
        // Fallthrough: false ensures that if an image isn't found, it automatically 404s
        // Wrap server static errors
        return (req, res, next) => {
            return serveStatic(this.getImagesDir(), {
                maxAge     : globalUtils.ONE_YEAR_MS,
                fallthrough: false
            })(req, res, function (err) {
                if (err) {
                    if (err.statusCode === 404) {
                        return next(new errors.NotFoundError({message: ""}));
                    }
                    return next(new errors.ChatteronError({err: err}));
                }
                next();
            });
        };
    }
}

const localStore = new LocalFileStore();

module.exports = localStore;
