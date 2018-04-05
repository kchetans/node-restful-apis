import PinCodeSchema from "../../mongo-models/PinCodeSchema";
import {jobCategories} from "./data/job_categories";
import GooglePlaces from "../../google-services/maps/index";
import {educations} from "./data/educations";
import Languages from "../../constants/languages.json";
import Educations from "../../constants/educations.json";
import Configs from "../../data-manager/Configs";

let staticMaster = {

    async getEducation(object, options, message){
        message = message || "Education fetched successfully";
        return {
            data: educations,
            message: message
        }
    },

    async getDesignation (object, options){
        return {
            data: Configs.getDesignation(),
            message: "All d"
        }
    },

    async getEducationDegree (object, options){
        return {
            data: Educations,
            message: "All d"
        }
    },

    async getAllCities(){

        let cities = await PinCodeSchema.find().distinct('city');

        return {
            data: _.map(cities, city => {
                return {
                    city
                }
            }),
            message: "All cities fetched successfully"
        }
    },

    async getPlaceFromGooglePlacesApis(object, options){
        let {q} = options.query;
        let cities = await GooglePlaces.getCityFromKey(q);
        return {
            data: cities,
            message: "All cities fetched successfully"
        }
    },

    async getCities(object, options){
        let {query} = options;
        let {q} = query;

        let cities = await PinCodeSchema.find({
                "city": {$regex: new RegExp(q, "i")}
            }, 'city'
        );

        cities = _.uniqBy(cities, city => city.city);
        cities = _.map(cities, city => city.city);

        return {
            data: cities,
            message: "Cities fetched successfully"
        }

    },

    async getStates(object, options){

    },

    async getCountries(object, options){

    },

    async getLanguages(object, options){
        return {
            data: Languages,
            message: "languages fetched successfully"
        }
    },

    /**
     * Give info for given pin code
     * @param object
     * @param options
     * @returns {{data, message: string}}
     */
    async getInfoFromPinCode(object, options) {
        let {params} = options;
        let {pincode} = params;

        let pinCodeInfo = await PinCodeSchema.findOne({
            pincode: parseInt(pincode)
        }, 'pincode state city');

        let filteredPinCodeInfo = _.pick(pinCodeInfo, ['pincode', 'state', 'city']);

        return {
            data: filteredPinCodeInfo,
            message: "fetched successfully"
        };
    },

    async getJobCategoryData(){
        return {
            data: jobCategories,
            message: "job categories fetched successfully"
        }
    }
};

export default staticMaster;
