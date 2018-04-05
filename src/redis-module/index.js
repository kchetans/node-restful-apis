import redis from "redis";
import config from "config";
import chalk from "chalk";
import overriderRedis from "./overrider-redis-functions";
let redisConfig = config.get("redis") || {user_redis: false};
let {user_redis = true} = redisConfig;
// use bluebird promise for redis promises
require('bluebird').promisifyAll(redis.RedisClient.prototype);
require('bluebird').promisifyAll(redis.Multi.prototype);

/** Expose all models */
exports = module.exports;

let redisClient = {};

exports.redisClient = redisClient;
exports.init = function init() {

    /**
     * you can switch off redis when required from config file,
     * then all query will go to mongodb, redis layer will be removed completely
     */
    if (!user_redis) {
        console.log(chalk.red(` Redis switch is off form config file.`));
        /* Override redis functions, so that when redis is off from config,
         our methods, will not break */
        overriderRedis(redisClient);
        return Promise.resolve();
    }

    let connectionUrl;
    /** Connect with the redis here */
    if (typeof redisConfig === 'string') {
        connectionUrl = redisConfig;
    } else {
        let {user, host, password} = redisConfig;
        connectionUrl = `redis://`;
        if (user && password) connectionUrl += `${user}:${password}@`;
        connectionUrl += `${host}`;
    }

    // redisClient = redis.createClient({url: connectionUrl});
    redisClient = redis.createClient();

    redisClient.on("ready", (err) => {
        console.log(chalk.green(`  ✅ Redis is ready`));

        // expose mongoose connection object
        module.exports.redisClient = redisClient;
    });

    redisClient.on("reconnecting", (delay, attempt) => {
        console.log(chalk.yellow(`  ⌚️ Redis is reconnecting in delay : ${delay} , attempt : ${attempt}`));
    });

    redisClient.on("error", (err) => {
        console.log(chalk.red(` Redis error `, err.message));
    });

    redisClient.on("end", (err) => {
        console.log(chalk.red(` Redis server connection has closed.`));
    });

    return Promise.resolve();
};
