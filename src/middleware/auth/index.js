/**
 * Created By KARTIK AGARWAL
 * on 8 June, 2017
 */

import passport from './passport'
import authenticate from './authenticate'

exports.init = function (nConfig) {
    return passport.init(nConfig)
        .then((response) => {
        return {auth: response.passport};
    });
};

module.exports.authenticate = authenticate;