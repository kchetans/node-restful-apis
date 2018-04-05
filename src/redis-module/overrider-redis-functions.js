/**
 * This file is used to override, redis functions,
 * only when redis is switched off from config file.
 *
 * All these methods will return empty promise, or undefined
 */

/**
 * common empty promsie,
 * it is used by all async function of redis
 * @returns {Promise}
 */
let emptyPromise = function () {
    return new Promise((resolve, reject) => {
        resolve(undefined);
    });
};

export default function (redisClient) {
    redisClient.getAsync = () => {
        return emptyPromise();
    };

    redisClient.set = () => {
        return undefined;
    };


    redisClient.setAsync = () => {
        return emptyPromise();
    };
};