import OtpSchema from "../mongo-models/OtpSchema";
let redis = require("../redis-module");

let OtpDataManager = {

    async sendAndSaveOtp(mobile_no, isNewUser){
        return await OtpSchema.sendAndSaveOtp(mobile_no, isNewUser);
    },


    async verifyOtp(otp, mobile_no){
        return await OtpSchema.verifyOtp(otp, mobile_no);
    },


};

export default OtpDataManager;