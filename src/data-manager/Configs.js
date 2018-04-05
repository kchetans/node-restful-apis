import categories from "../constants/job-categories.json";
import categoriesImages from "../constants/job-categories-images.json";
import categoriesImagesRandom from "../constants/job-categories-images-random.json";
import designation from "../constants/designation.json";
let redis = require("../redis-module");
const JOB_CATEGORIES = "JOB_CATEGORIES";
const JOB_CATEGORIES_IMAGES = "JOB_CATEGORIES_IMAGES";

let chats = {

    getJobCategory(query){
        return categories;
    },

    getJobCategoryImage(){
        return categoriesImages;
    },

    getJobCategoryImageRandom(){
        return categoriesImagesRandom;
    },

    getDesignation(){
        return designation;
    },
};

export default chats;