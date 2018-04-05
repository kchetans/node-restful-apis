/**
 * Created By KARTIK AGARWAL
 * on 8 July 2017
 */
import ConfigsDataManager from "../../../data-manager/Configs";
import {JOB_CATEGORY_IMAGES, JOB_CATEGORY_RANDOM_IMAGES} from "../../../constants/application";
let errors = require("../../../errors");

const JOB_CATEGORIES = "JOB_CATEGORIES";
const JOB_CATEGORIES_IMAGES = "JOB_CATEGORIES_IMAGES";

let updateJobs = {

    async getJobCategory(object, options){
        let {query} = options;
        let {q} = query;
        let categories = ConfigsDataManager.getJobCategory(q);
        return {
            data: categories,
            message: "All categories fetched successfully"
        }
    },

    async getCategoryImages(object, options){
        let {category} = options.params;
        if (JOB_CATEGORY_IMAGES[category]) {
            let images = JOB_CATEGORY_IMAGES[category];
            return {
                data: images [_.random(0, images.length - 1)],
                message: "image"
            }
        } else {
            throw new errors.ValidationError({
                message: `${category} does not exist`
            });
        }
    },

    async getCategoryRandomImages(object, options){
        let {category} = options.params;
        if (JOB_CATEGORY_RANDOM_IMAGES[category]) {
            let images = JOB_CATEGORY_RANDOM_IMAGES[category];
            return {
                data: images [_.random(0, images.length - 1)],
                message: "image"
            }
        } else {
            throw new errors.ValidationError({
                message: `${category} does not exist`
            });
        }
    }
};

export default updateJobs;