import request from "request-promise";
import chalk from 'chalk';
import config from "config";
let mapsApiKey = config.get("mapsApiKey");

let googlePlaces = {

    async getCityFromKey(cityKey){
        let uri = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${cityKey}&types=(cities)&key=${mapsApiKey}&components=country:IN
`;
        return request({
            uri,
            json: true
        }).then(response => {
            let {status, predictions} = response;
            switch (status) {
                case "OK":
                    return _.map(predictions, ({structured_formatting = {}}) => {
                        return structured_formatting.main_text;
                    });
                    break;
                case "ZERO_RESULTS":
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
                    break;
            }
        }).catch(err => {
            console.log("err", err);
        });
    },

};

export default googlePlaces;

