const jwt = require('jsonwebtoken');
const Promise = require('bluebird');
const _ = require('lodash');

const config = require('config');
const errors = require('../errors');
const verifyAsync = Promise.promisify(jwt.verify);
import UserProfileDataManager from "../data-manager/UserProfileDataManager";
/**
 * Created by Kartik Agarwal
 */


/**
 * Reads secret used to sign all tokens
 */
function readTokenSecret() {
    return Promise.resolve(config.get("tokenSecret"));
}

var jwtHelper = {


    /**
     * Generate token for the user
     * @param userInfo
     */
    async generateLoginToken(userInfo){
        let tokenPayload = _.pick(userInfo, ['_id', 'mobile_no', 'roles']);
        return jwtHelper.generateToken(tokenPayload)
            .then((token) => {
                // now store the generated token
                UserProfileDataManager.update({_id: userInfo._id}, {$set: {auth_token: token}});
                return token;
            });
    },

    verifyToken: (token) => {
        return readTokenSecret().then((jwtSecret) => {
            // verify the token for signature authenticity
            return verifyAsync(token, jwtSecret);
        }).then(function (decoded) {
            return Promise.resolve(decoded);
        }).catch(function onError(error) {
            // decorate the error while decoding
            var errorToPropagate;
            switch (error.name) {
                // token expiration error
                case 'TokenExpiredError':
                    errorToPropagate = new errors.UnauthorizedError({message: error.message});
                    break;
                // token malformed, signature missing, invalid sign etc.
                case 'JsonWebTokenError':
                    errorToPropagate = new errors.BadRequestError({message: error.message});
                    break;
                default:
                    errorToPropagate = error;
                    break;
            }
            return Promise.reject(errorToPropagate);
        });
    },

    /**
     * Generates a new new token from the given payload
     * @param payload
     * @param expiryTime
     */
    generateToken: (payload, expiryTime) => {
        return readTokenSecret()
            .then((jwtSecret) => {
                return new Promise((resolve, reject) => {
                    jwt.sign(payload, jwtSecret, {
                        expiresIn: expiryTime
                    }, (err, token) => {
                        if (err) reject(err);
                        resolve(token);
                    });
                });
            });
    }
};

module.exports = jwtHelper;