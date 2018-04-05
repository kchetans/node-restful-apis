/**
 * Created By KARTIK AGARWAL
 * on 14 Jun 2017
 */
import chalk from "chalk";
import request from "request-promise";
import JobPostingSchema from "../../../mongo-models/JobPostingSchema";
import UserProfileSchema from "../../../mongo-models/UsersProfileSchema";
import config from "config";
let mapsApiKey = config.get("mapsApiKey");

let jobLibs = {

    async __saveLocationForJob(job_id, formatted_address, location, user){
        await JobPostingSchema.update({_id: job_id}, {$set: {formatted_address, location}}, user).exec();
    },

    getLocationAndStore(job_id, {address, city}, user){
        address = address + " " + city;
        let uri = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${mapsApiKey}`;
        request({
            uri,
            json: true
        }).then(response => {
            let {status, results} = response;
            switch (status) {
                case "OK":
                    /** indicates that no errors occurred; the address was successfully parsed and at least one geocode was returned.*/
                    if (results && results[0]) {
                        let formatted_address = results[0].formatted_address;
                        let location = results[0].geometry.location;
                        jobLibs.__saveLocationForJob(job_id, formatted_address, location, user);
                    }
                    break;
                case "ZERO_RESULTS":
                    /**  indicates that the geocode was successful but returned no results. This may occur if the geocoder was passed a non-existent address. **/
                    if (address == "")
                        city = "India";
                    address = "";
                    setTimeout(() => jobLibs.getLocationAndStore(job_id, {address, city}), 5000);
                    break;
                case "OVER_QUERY_LIMIT":
                    /** indicates that you are over your quota. */
                    console.log(chalk.red("!!!!*******************Google MAP api OVER_QUERY_LIMIT*******************!!!!"));
                    break;
                case "REQUEST_DENIED":
                    break;
                case "INVALID_REQUEST":
                    break;
                case "UNKNOWN_ERROR":
                    /**  indicates that the request could not be processed due to a server error. The request may succeed if you try again.*/
                    setTimeout(() => jobLibs.getLocationAndStore(job_id, {address, city}), 5000);
                    break;
            }
        }).catch(err => {
            console.log("err", err);
        });
    },

    /* Get Map object of Bookmarked jobs*/
    async getBookMarkMap(user_id) {
        let userProfiles = await UserProfileSchema.findOne({user_id}, {"bookmarks": 1, "_id": 0}).lean();
        let bookmarkMap = new Map();
        if (!userProfiles)
            return bookmarkMap;
        _.map(userProfiles.bookmarks, bookmarks => bookmarkMap.set(bookmarks.toHexString(), true));
        return bookmarkMap;
    }

};

export default jobLibs;