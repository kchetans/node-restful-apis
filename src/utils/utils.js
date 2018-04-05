//dependencies
const os = require('os');
const util = require('util');
const async = require('async');
const _ = require('lodash');
const extend = require('node.extend');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const moment = require('moment-timezone');

function compare(val1, val2, strict) {
    return strict ? val1 === val2 : val1 == val2;
}

/**
 * Provides a set of utility functions used throughout the code base
 *
 * @module Services
 * @class Util
 * @constructor
 */
function Util() {
}

/**
 * Method to compare deep objects
 * @param obj1
 * @param obj2
 * @param strict
 * @returns {boolean}
 */
Util.deepEqual = (obj1, obj2, strict) => {
    var isEqual = true;

    var object1Keys = Object.keys(obj1);
    var object2Keys = Object.keys(obj2);

    var firstKeyAlias = object1Keys;
    var secondKeyAlias = object2Keys;

    var object1Alias = obj1;
    var object2Alias = obj2;

    if (object2Keys.length > object1Keys.length) {
        firstKeyAlias = object2Keys;
        secondKeyAlias = object1Keys;
        object1Alias = obj2;
        object2Alias = obj1;
    }

    for (var i = 0, co = firstKeyAlias.length; i < co; i++) {
        var key = firstKeyAlias[i];
        if (strict && !compare(typeof object1Alias[key], typeof object2Alias[key], strict)) {
            isEqual = false;
            continue;
        }
        if (typeof object1Alias[key] === 'function') {
            if (!compare(object1Alias[key].toString(), object2Alias[key].toString(), strict)) {
                isEqual = false;
            }
            continue;
        }
        if (typeof object1Alias[key] === 'object') {
            if (object1Alias[key].length !== undefined) { // array
                var temp = object1Alias[key].slice(0);
                temp = temp.filter(function (el) {
                    return (object2Alias[key].indexOf(el) === -1);
                });
                if (temp.length > 0) {
                    isEqual = false;
                }

                temp = object2Alias[key].slice(0);
                temp = temp.filter(function (el) {
                    return (object1Alias[key].indexOf(el) === -1);
                });
                if (temp.length > 0) {
                    isEqual = false;
                }
                continue;
            }
            isEqual &= Util.deepEqual(object1Alias[key], object2Alias[key], strict);
            continue;
        }
        // Simple types left so
        if (!compare(object1Alias[key], object2Alias[key], strict)) {
            isEqual = false;
        }
    }
    return isEqual;
};

/**
 * Extract the number from the string if found else return false
 * @param str
 * @returns {*}
 */
Util.extractNumber = function (str) {
    var result;
    try {
        result = parseInt(str);
    } catch (err) {
        result = false;
    }
    return result;
};

/**
 * @clientOffset is offset in minutes
 * @param clientOffset
 * @returns {Date|global.Date}
 */
Util.localToClientTime = (clientOffset) => {
    return Util.getOffsetTime(new Date(), clientOffset);
};

/**
 * returns time offset by the given amount with @refDate as the base date
 * @param refDate
 * @param clientOffset
 * @returns {Date|global.Date}
 */
Util.getOffsetTime = (refDate, clientOffset) => {
    var referenceTime = new Date(refDate);
    var localTime = referenceTime.getTime();
    var localOffset = referenceTime.getTimezoneOffset() * 60000;

    // offset  = UTC - localtime
    var utc = localTime + localOffset;

    // localTime = UTC - offset
    return new Date(utc - (60000 * clientOffset));
};

/**
 * Check is string is valid for date or not.
 * It does not handle relative dates.
 *
 * @param dateString
 * @returns {boolean}
 */
Util.checkValidDate = (dateString) => {
    var dateToCheck = new Date(dateString);
    var isValidTime = false;
    if (Object.prototype.toString.call(dateToCheck) === "[object Date]") {
        // it is a date
        isValidTime = !isNaN(dateToCheck.getTime());
    } else {
        // not a date
        isValidTime = false;
    }
    return isValidTime;
};

Util.range = function (size) {
    var array = _.range(size);
    // remove the first item which is 0 and include the last item in the array
    return array.slice(1, size).concat(size);
};

/**
 * Check if string is a digit
 * @param str
 * @returns {boolean}
 */
Util.isDigit = function (str) {
    return /^\d+$/.test(str);
};

Util.randIndex = function (arr) {
    var index = Math.floor(arr.length * Math.random());
    return arr[index];
};

/**
 * Clones an object by serializing it and then re-parsing it.
 * WARNING: Objects with circular dependencies will cause an error to be thrown.
 * @static
 * @method clone
 * @param {Object} object The object to clone
 * @return {Object} Cloned object
 */
Util.clone = function (object) {
    return JSON.parse(JSON.stringify(object));
};

/**
 * Renames a given property in object
 * @param object
 * @param oldName
 * @param newName
 * @returns {*}
 */
Util.renameProperty = function (object, oldName, newName) {
    // Do nothing if the names are the same
    if (oldName == newName) {
        return object;
    }
    // Check for the old property name to avoid a ReferenceError in strict mode.
    if (object.hasOwnProperty(oldName)) {
        object[newName] = object[oldName];
        delete object[oldName];
    }
    return object;
};

/**
 * Performs a deep merge and returns the result.  <b>NOTE:</b> DO NOT ATTEMPT
 * TO MERGE PROPERTIES THAT REFERENCE OTHER PROPERTIES.  This could have
 * unintended side-effects as well as cause errors due to circular dependencies.
 * @static
 * @method deepMerge
 * @param {Object} from
 * @param {Object} to
 * @return {Object}
 */
Util.deepMerge = function (from, to) {
    return extend(true, to, from);
};

/**
 * Checks if the supplied object is an errof. If the object is an error the
 * function will throw the error.
 * @static
 * @method ane
 * @param {Object} obj The object to check
 */
Util.ane = function (obj) {
    if (util.isError(obj)) {
        throw obj;
    }
};

/**
 * Initializes an array with the specified number of values.  The value at each
 * index can be static or a function may be provided.  In the event that a
 * function is provided the function will be called for each item to be placed
 * into the array.  The return value of the function will be placed into the
 * array.
 * @static
 * @method initArray
 * @param {Integer} cnt The length of the array to create
 * @param {Function|String|Number} val The value to initialize each index of
 * the array
 * @return {Array} The initialized array
 */
Util.initArray = function (cnt, val) {
    var v = [];
    var isFunc = Util.isFunction(val);
    for (var i = 0; i < cnt; i++) {
        v.push(isFunc ? val(i) : val);
    }
    return v;
};

/**
 * Escapes a regular expression.
 * @static
 * @method escapeRegExp
 * @param {String} The expression to escape
 * @return {String} Escaped regular expression.
 */
Util.escapeRegExp = function (str) {
    if (!Util.isString(str)) {
        return null;
    }
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};

/**
 * Merges the properties from the first parameter into the second. This modifies
 * the second parameter instead of creating a new object.
 *
 * @method merge
 * @param {Object} from
 * @param {Object} to
 * @return {Object} The 'to' variable
 */
Util.merge = function (from, to) {
    Util.forEach(from, function (val, propName/*, */) {
        to[propName] = val;
    });
    return to;
};

/**
 * Creates an object that has both the properties of "a" and "b".  When both
 * objects have a property with the same name, "b"'s value will be preserved.
 * @static
 * @method union
 * @return {Object} The union of properties from both a and b.
 */
Util.union = function (a, b) {
    var union = {};
    Util.merge(a, union);
    Util.merge(b, union);
    return union;
};

/**
 * Creates a set of tasks that can be executed by the "async" module.
 * @static
 * @method getTasks
 * @param {Array} iterable The array of items to build tasks for
 * @param {Function} getTaskFunction The function that creates and returns the
 * task to be executed.
 * @example
 * <code>
 * var items = ['apple', 'orange'];
 * var tasks = util.getTasks(items, function(items, i) {
 *     return function(callback) {
 *         console.log(items[i]);
 *         callback(null, null);
 *     };
 * });
 * async.series(tasks, util.cb);
 * <code>
 */
Util.getTasks = function (iterable, getTaskFunction) {
    var tasks = [];
    for (var i = 0; i < iterable.length; i++) {
        tasks.push(getTaskFunction(iterable, i));
    }
    return tasks;
};

/**
 * Wraps a function in an anonymous function.  The wrapper function will call
 * the wrapped function with the provided context.  This comes in handy when
 * creating your own task arrays in conjunction with the async function when a
 * prototype function needs to be called with a specific context.
 * @static
 * @method wrapTask
 * @param {Function} context The value of "this" for the function to be called
 * @param {Function} func The function to be executed
 * @param {Array} [argArray] The arguments to be supplied to the func parameter
 * when executed.
 * @return {Function}
 */
Util.wrapTask = function (context, func, argArray) {
    if (!util.isArray(argArray)) {
        argArray = [];
    }
    return function (callback) {
        argArray.push(callback);
        func.apply(context, argArray);
    };
};

/**
 * Provides an implementation of for each that accepts an array or object.
 * @static
 * @method forEach
 * @param {Object|Array} iterable
 * @param {Function} handler A function that accepts 4 parameters.  The value
 * of the current property or index.  The current index (property name if object).  The iterable.
 * Finally, the numerical index if the iterable is an object.
 */
Util.forEach = function (iterable, handler) {

    var internalHandler = handler;
    var internalIterable = iterable;
    if (util.isArray(iterable)) {
        //no-op but we have to type check here first because an array is an object
    }
    else if (Util.isObject(iterable)) {

        internalIterable = Object.getOwnPropertyNames(iterable);
        internalHandler = function (propName, i) {
            handler(iterable[propName], propName, iterable, i);
        };
    }
    else {
        return false;
    }

    //execute native foreach on interable
    internalIterable.forEach(internalHandler);
};

/**
 * Hashes an array
 * @static
 * @method arrayToHash
 * @param {Array} array      The array to hash
 * @param {*} defaultVal Default value if the hashing fails
 * @return {Object} Hash
 */
Util.arrayToHash = function (array, defaultVal) {
    if (!util.isArray(array)) {
        return null;
    }

    //set the default value
    if (Util.isNullOrUndefined(defaultVal)) {
        defaultVal = true;
    }
    var hash = {};
    for (var i = 0; i < array.length; i++) {
        if (Util.isFunction(defaultVal)) {
            hash[defaultVal(array, i)] = array[i];
        }
        else {
            hash[array[i]] = defaultVal;
        }
    }
    return hash;
};

/**
 * Converts an array to an object.
 * @static
 * @method arrayToObj
 * @param {Array} array The array of items to transform from an array to an
 * object
 * @param {String|Function} keyFieldOrTransform When this field is a string it
 * is expected that the array contains objects and that the objects contain a
 * property that the string represents.  The value of that field will be used
 * as the property name in the new object.  When this parameter is a function
 * it is passed two parameters: the array being operated on and the index of
 * the current item.  It is expected that the function will return a value
 * representing the key in the new object.
 * @param {String|Function} [valFieldOrTransform] When this value is a string
 * it is expected that the array contains objects and that the objects contain
 * a property that the string represents.  The value of that field will be used
 * as the property value in the new object.  When this parameter is a function
 * it is passed two parameters: the array being operated on and the index of
 * the current item.  It is expected that the function return a value
 * representing the value of the derived property for that item.
 * @return {Object} The converted array.
 */
Util.arrayToObj = function (array, keyFieldOrTransform, valFieldOrTransform) {
    if (!util.isArray(array)) {
        return null;
    }

    var keyIsString = Util.isString(keyFieldOrTransform);
    var keyIsFunc = Util.isFunction(keyFieldOrTransform);
    if (!keyIsString && !keyIsFunc) {
        return null;
    }

    var valIsString = Util.isString(valFieldOrTransform);
    var valIsFunc = Util.isFunction(valFieldOrTransform);
    if (!valIsString && !valIsFunc) {
        valFieldOrTransform = null;
    }

    var obj = {};
    for (var i = 0; i < array.length; i++) {

        var item = array[i];
        var key = keyIsString ? item[keyFieldOrTransform] : keyFieldOrTransform(array, i);

        if (valIsString) {
            obj[key] = item[valFieldOrTransform];
        }
        else if (valIsFunc) {
            obj[key] = valFieldOrTransform(array, i);
        }
        else {
            obj[key] = item;
        }
    }
    return obj;
};

/**
 * Converts an array of objects into a hash where the key the value of the
 * specified property. If multiple objects in the array have the same value for
 * the specified value then the last one found will be kept.
 * @static
 * @method objArrayToHash
 * @param {Array} array The array to convert
 * @param {String} hashProp The property who's value will be used as the key
 * for each object in the array.
 * @return {Object} A hash of the values in the array
 */
Util.objArrayToHash = function (array, hashProp) {
    if (!util.isArray(array)) {
        return null;
    }

    var hash = {};
    for (var i = 0; i < array.length; i++) {
        hash[array[i][hashProp]] = array[i];
    }
    return hash;
};

/**
 * Converts a hash to an array. When provided, the hashKeyProp will be the
 * property name of each object in the array that holds the hash key.
 * @static
 * @method hashToArray
 * @param {Object} obj The object to convert
 * @param {String} [hashKeyProp] The property name that will hold the hash key.
 * @return {Array} An array of each property value in the hash.
 */
Util.hashToArray = function (obj, hashKeyProp) {
    if (!Util.isObject(obj)) {
        return null;
    }

    var a = [];
    var doHashKeyTransform = Util.isString(hashKeyProp);
    for (var prop in obj) {
        a.push(obj[prop]);
        if (doHashKeyTransform) {
            obj[prop][hashKeyProp] = prop;
        }
    }
    return a;
};

/**
 * Inverts a hash
 * @static
 * @method invertHash
 * @param {Object} obj Hash object
 * @return {Object} Inverted hash
 */
Util.invertHash = function (obj) {
    if (!Util.isObject(obj)) {
        return null;
    }

    var new_obj = {};
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            new_obj[obj[prop]] = prop;
        }
    }
    return new_obj;
};

/**
 * Clones an array
 * @static
 * @method copyArray
 * @param {Array} array
 * @return {Array} Cloned array
 */
Util.copyArray = function (array) {
    if (!util.isArray(array)) {
        return null;
    }

    var clone = [];
    for (var i = 0; i < array.length; i++) {
        clone.push(array[i]);
    }
    return clone;
};

/**
 * Pushes all of one array's values into another
 * @static
 * @method arrayPushAll
 * @param {Array} from
 * @param {Array} to
 * @return {Boolean} FALSE when the parameters are not Arrays
 */
Util.arrayPushAll = function (from, to) {
    if (!util.isArray(from) || !util.isArray(to)) {
        return false;
    }

    for (var i = 0; i < from.length; i++) {
        to.push(from[i]);
    }
};

/**
 * Tests if a value is an object
 * @static
 * @method isObject
 * @param {*} value
 * @return {Boolean}
 */
Util.isObject = function (value) {
    return !Util.isNullOrUndefined(value) && typeof value === 'object';
};

/**
 * Tests if a value is an string
 * @static
 * @method isString
 * @param {*} value
 * @return {Boolean}
 */
Util.isString = function (value) {
    return !Util.isNullOrUndefined(value) && typeof value === 'string';
};

/**
 * Tests if a value is a function
 * @static
 * @method isFunction
 * @param {*} value
 * @return {Boolean}
 */
Util.isFunction = function (value) {
    return !Util.isNullOrUndefined(value) && typeof value === 'function';
};

/**
 * Tests if a value is NULL or undefined
 * @static
 * @method isNullOrUndefined
 * @param {*} value
 * @return {Boolean}
 */
Util.isNullOrUndefined = function (value) {
    return value === null || typeof value === 'undefined';
};

/**
 * Tests if a value is a boolean
 * @static
 * @method isBoolean
 * @param {*} value
 * @return {Boolean}
 */
Util.isBoolean = function (value) {
    return value === true || value === false;
};

/**
 * Retrieves file and/or directorie absolute paths under a given directory path.
 * @static
 * @method getFiles
 * @param {String} dirPath The path to the directory to be examined
 * @param {Object} [options] Options that customize the results
 * @param {Boolean} [options.recursive=false] A flag that indicates if
 * directories should be recursively searched.
 * @param {Function} [options.filter] A function that returns a boolean
 * indicating if the file should be included in the result set.  The function
 * should take two parameters.  The first is a string value representing the
 * absolute path of the file.  The second is the stat object for the file.
 * @param {Function} cb A callback that takes two parameters. The first is an
 * Error, if occurred. The second is an array of strings representing the
 * absolute paths for files that met the criteria specified by the filter
 * function.
 */
Util.getFiles = function (dirPath, options, cb) {
    if (Util.isFunction(options)) {
        cb = options;
        options = {
            recursive: false,
            filter: function (/*fullPath, stat*/) {
                return true;
            }
        };
    }

    //read files from dir
    fs.readdir(dirPath, function (err, q) {
        if (util.isError(err)) {
            return cb(err);
        }

        //seed the queue
        for (var i = 0; i < q.length; i++) {
            q[i] = path.join(dirPath, q[i]);
        }

        //process the q
        var filePaths = [];
        async.whilst(
            function () {
                return q.length > 0;
            },
            function (callback) {

                var fullPath = q.shift();
                fs.stat(fullPath, function (err, stat) {
                    if (util.isError(err)) {
                        return callback(err);
                    }

                    //apply filter
                    var meetsCriteria = true;
                    if (Util.isFunction(options.filter)) {
                        meetsCriteria = options.filter(fullPath, stat);
                    }

                    //examine result and add it when criteria is met
                    if (meetsCriteria) {
                        filePaths.push(fullPath);
                    }

                    //when recursive queue up directory's for processing
                    if (options.recursive && stat.isDirectory()) {
                        fs.readdir(fullPath, function (err, childFiles) {
                            if (util.isError(err)) {
                                return callback(err);
                            }

                            childFiles.forEach(function (item) {
                                q.push(path.join(fullPath, item));
                            });
                            callback(null);
                        });
                    }
                    else {
                        callback(null);
                    }
                });
            },
            function (err) {
                cb(err, filePaths);
            }
        );
    });
};

/**
 * Retrieves the extension off of the end of a string that represents a URI to
 * a resource
 * @static
 * @method getExtension
 * @param {String} filePath URI to the resource
 * @param {Object} [options]
 * @param {Boolean} [options.lower=false] When TRUE the extension will be returned as lower case
 * @param {String} [options.sep] The file path separator used in the path.  Defaults to the OS default.
 * @return {String} The value after the last '.' character
 */
Util.getExtension = function (filePath, options) {
    if (!Util.isString(filePath) || filePath.length <= 0) {
        return null;
    }
    if (!Util.isObject(options)) {
        options = {};
    }

    //do to the end of the path
    var pathPartIndex = filePath.lastIndexOf(options.sep || path.sep) || 0;
    if (pathPartIndex > -1) {
        filePath = filePath.substr(pathPartIndex);
    }

    var ext = null;
    var index = filePath.lastIndexOf('.');
    if (index >= 0) {
        ext = filePath.substring(index + 1);

        //apply options
        if (options.lower) {
            ext = ext.toLowerCase();
        }
    }
    return ext;
};

//inherit from node's version of 'util'.  We can't use node's "util.inherits"
//function because util is an object and not a prototype.
Util.merge(util, Util);

/**
 * Overrides the basic inherit functionality to include static functions and
 * properties of prototypes
 * @static
 * @method inherits
 * @param {Function} Type1
 * @param {Function} Type2
 */
Util.inherits = function (Type1, Type2) {
    if (Util.isNullOrUndefined(Type1) || Util.isNullOrUndefined(Type2)) {
        throw new Error('The type parameters must be objects or prototypes');
    }

    util.inherits(Type1, Type2);
    Util.merge(Type2, Type1);
};

/**
 * Provides typical conversions for time
 * @static
 * @readonly
 * @property TIME
 * @type {Object}
 */
Util.TIME = Object.freeze({

    MILLIS_PER_SEC: 1000,
    MILLIS_PER_MIN: 60000,
    MILLIS_PER_HOUR: 3600000,
    MILLIS_PER_DAY: 86400000
});

/**
 *
 * @param obj
 * @returns {boolean}
 */
Util.checkNested = function checkNested(obj /*, level1, level2, ... levelN*/) {
    var args = Array.prototype.slice.call(arguments, 1);

    for (var i = 0; i < args.length; i++) {
        if (!obj || !obj.hasOwnProperty(args[i])) {
            return false;
        }
        obj = obj[args[i]];
    }
    return true;
};

/**
 * Check if url is a valid URL
 * @param url
 * @returns {boolean}
 */
Util.isUrl = (url) => {
    const pattern = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,63}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    return pattern.test(url);
};

/**
 * Check if the @valueToCheck is strictly empty
 * @param valueToCheck
 * @return {boolean}
 */
Util.isStrictEmpty = (valueToCheck) => {
    if (_.isObject(valueToCheck)) {
        // if all values in the object are null or undefined, it's treated as empty
        return !_.some(valueToCheck, (value) => !Util.isNullOrUndefined(value));
    }
    return _.isEmpty(valueToCheck);
};

/**
 * Update or insert a new item in array
 * @param array
 * @param findFunction
 * @param update
 * @param copyProps
 */
Util.upsertArray = (array, findFunction, update, copyProps = true) => {
    let findItem = _.find(array, findFunction);
    if (findItem) {
        let indexOfItem = _.indexOf(array, findItem);
        let localUpdate = update;
        if (copyProps) {
            _.extend(findItem, localUpdate);
            localUpdate = findItem;
        }
        array.splice(indexOfItem, 1, localUpdate);
    } else {
        array.push(update);
    }
};

/**
 * Delete all properties from the object except the given ones
 */
Util.deleteAllExcept = function (object, propsToKeep) {
    let allKeys;
    // document might be a mongoose document in which case we need to convert it to object
    if (typeof object['toObject'] == 'function') {
        allKeys = _.keys(object.toObject());
    } else {
        allKeys = _.keys(object)
    }

    _.forEach(allKeys, (key) => {
        if (!_.includes(propsToKeep, key)) {
            delete object[key];
            object[key] = undefined;
        }
    });
};

/**
 * Convert @values to an array
 * @param value
 */
Util.makeArray = (value) => {
    let arr = [];
    if (Util.isNullOrUndefined(value)) return arr;

    if (_.isArray(value)) arr = value;
    else arr = [value];

    return arr;
};

/**
 * Check if its a number
 */
Util.isNumber = (number) => {
    return !isNaN(parseFloat(number)) && isFinite(number);
};

/**
 * Return a unique identifier with the given `len`.
 *
 *     analyzer.uid(10);
 *     // => "FDaS435D2z"
 *
 * @param {Number} len
 * @return {String}
 * @api private
 */
Util.uid = (len) => {
    var buf = [],
        chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        charlen = chars.length,
        i;

    for (i = 1; i < len; i = i + 1) {
        buf.push(chars[_.random(0, charlen - 1)]);
    }

    return buf.join('');
};

// The token is encoded URL safe by replacing '+' with '-', '\' with '_' and removing '='
// NOTE: the token is not encoded using valid base64 anymore
Util.encodeBase64URLsafe = (base64String) => {
    return base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};


Util.timedMobileNo = (mobile_no = '') => {
    mobile_no = _.trim(mobile_no);
    mobile_no.replace("-", '');
    mobile_no.replace(" ", '');
    return mobile_no.substr(mobile_no.length - 10);
};

//exports
module.exports = Util;
