/**
 * Created By KARTIK AGARWAL
 * on 9 June, 2017
 */
let passport = require('passport');
let config = require('config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
import UserProfileDataManager  from '../../data-manager/UserProfileDataManager'

let authStrategies = {
    /**
     * This strategy is used to authenticate users based on a JWT token.
     * Verifies a token and checks for the existence of given id in the database
     * @param jwtPayload
     * @param done
     * @return {*}
     * @constructor
     */
    async JwtStrategy(jwtPayload, done) {
        let theUser = await UserProfileDataManager.getUser(jwtPayload._id);
        if (theUser) {
            /** Update last seen for user**/
            UserProfileDataManager.updateLastSeen(jwtPayload._id);
            return done(null, theUser);
        } else {
            return done(null, false);
        }
    },
};

exports.init = function initPassport() {
    const authConf = config.get("auth");
    const tokenSecret = config.get("tokenSecret");
    const integrationConf = config.get("integration");

    // Initialize passport for authentication
    const jwtOptions = {
        secretOrKey: tokenSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeader()
    };

    passport.use(new JwtStrategy(jwtOptions, authStrategies.JwtStrategy));


    return Promise.resolve({passport: passport.initialize()});
};