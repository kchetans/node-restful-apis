
import mongoose, {Schema} from "mongoose";

import baseModel from "./base";
import * as errors from "../errors";

const EmailUrlToken = new Schema({
    // access token of the user
    token: {type: String, required: true},

    // user for which token was issued
    user: {type: Schema.Types.ObjectId, ref: 'UserAccount', required: true},

    // no of times token has been attempted for usage
    hits: {type: Number, default: 0},

    // expiry time of the token
    expirationTime: {type: Date, required: true}
});

EmailUrlToken.plugin(baseModel, {});

/**
 * Helper method to validate a given reset token
 * @param resetToken
 * @return {Query|*|Promise}
 */
EmailUrlToken.statics.validateToken = async function (resetToken) {

    let tokenInfo = await this.findOne({"token": resetToken});
    if (!tokenInfo) throw new errors.ValidationError({message: `Invalid token '${resetToken}.'`});

    let user = tokenInfo.user;

    // increment the hits counter for the token
    await this.update({
        _id: tokenInfo._id
    }, {
        $inc: {hits: 1}
    });

    let now = moment();
    let tokenExpiry = moment(tokenInfo.expirationTime);
    if (now > tokenExpiry) throw new errors.ValidationError({message: "Token has expired"});

    return tokenInfo;
};

const EmailUrlTokensModel = mongoose.model('email_url_tokens', EmailUrlToken);

export default EmailUrlTokensModel;

