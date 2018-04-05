/**
 * Created By KARTIK AGARWAL
 * on 8 June, 2017
 */

const passport = require('passport');
import * as errors from "../../errors";
import {ROLES} from "../../constants/application";


// Check if the authorization header contains the supported scheme.
function isJWTAuthorizationHeader(req) {
    var parts,
        scheme;

    if (req.headers && req.headers.authorization) {
        parts = req.headers.authorization.split(' ');
    } else {
        return false;
    }

    if (parts.length === 2) {
        scheme = parts[0];
        if (/^JWT/i.test(scheme)) {
            return true;
        }
    }
    return false;
}
let auth = {

    authenticateUserSocket(token){
        return new Promise((resolve, reject) => {
            passport.authenticate('jwt', {session: false},
                function (err, user, info) {
                    if (err) {
                        reject(new errors.BadRequestError({message: "500 error"}));
                    }
                    let errorMsg;
                    if (user) {
                        return resolve(user);
                    } else if (isJWTAuthorizationHeader({
                            headers: {
                                authorization: token
                            }
                        })) {
                        errorMsg = info ? info.message : "Invalid auth token.";
                        reject(new errors.BadRequestError({message: errorMsg}));
                    }

                    errorMsg = info ? info.message : "Verification failed.";
                    throw reject(new errors.UnauthorizedError({message: errorMsg}));
                }
            );
        });
    },

    /**
     * Authenticate  User Middleware, verify token given by user
     */
    authenticateUser(req, res, next){
        let needAuth = true;

        if (req.method === 'OPTIONS') {
            needAuth = false;
        }

        if (needAuth)
            return passport.authenticate('jwt', {session: false},
                function (err, user, info) {
                    if (err) {
                        return next(err); // will generate a 500 error
                    }
                    let errorMsg;
                    if (user) {
                        req.user = user;
                        return next(null, user, info);
                    } else if (isJWTAuthorizationHeader(req)) {
                        if (req.headers)
                            console.log("req.headers.authorization", req.headers.authorization);
                        errorMsg = info ? info.message : "Invalid auth token.";
                        return next(new errors.BadRequestError({message: errorMsg}));
                    }

                    errorMsg = info ? info.message : "Verification failed.";
                    return next(new errors.UnauthorizedError({message: errorMsg}));
                }
            )(req, res, next);
        else
            next();
    },

    authenticateEmployer(req, res, next){
        let {user} = req;
        if (user && user.roles === ROLES.EMPLOYER) {
            return next();
        } else {
            next(new errors.BadRequestError({message: "Not Employer"}));
        }
    },

    authenticateEmployee(req, res, next){
        let {user} = req;
        if (user && user.roles === ROLES.EMPLOYEE) {
            next();
        } else {
            next(new errors.BadRequestError({message: "Not Employee"}));
        }
    },
};

export default auth;
