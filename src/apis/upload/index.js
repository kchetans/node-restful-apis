import filesUploads from "./files-uploads";
import AWS from "aws-sdk";
import uuid from "uuid";
import config from "config";
import chalk from "chalk";
let s3Config = config.get('aws').s3;

if (!s3Config) {
    console.log(chalk.red("s3Config not found"));
    s3Config = {};
}

const uploadsRoutes = require('express').Router();
let api = require('_includes').api;
let multer = require('multer');
let multerS3 = require('multer-s3');
let path = require('path');

AWS.config.update({
    "accessKeyId": s3Config.accessKeyId,
    "secretAccessKey": s3Config.secretAccessKey,
    "region": s3Config.region
});

let s3 = new AWS.S3();

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../../uploads'))
    },
    filename: (req, file, cb) => {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        let newFileName = `${file.fieldname}-${Date.now()}.${extension}`;
        cb(null, newFileName)
    }
});
let upload = multer({storage: storage});

function uploadAWS(bucket_name) {
    return multer({
        storage: multerS3({
            s3: s3,
            acl: 'public-read',
            contentType: multerS3.AUTO_CONTENT_TYPE,
            bucket: bucket_name,
            key: function (req, file, cb) {
                let {originalname} = file;
                let image_name = uuid() + '-' + originalname;
                req.params = Object.assign({}, req.param, {image_name});
                cb(null, image_name);
            },
        })
    });
};

let customMiddleWare = function (req, res, next) {
    let {query} = req;
    let {tags} = query;

    let respectiveBucket = s3Config.bucket_name; //default

    switch (tags) {
        case "documents":
            respectiveBucket = "wx-documents";
            break;
        case "profile_pic":
            if (process.env.NODE_ENV !== 'production')
                respectiveBucket = "wx-profile-pics";
            respectiveBucket = "wx-profile-pic";
            break;
        case "job_cover_pic":
            respectiveBucket = "wx-job-cover-pic";
            break;
        case "user_cover_pic":
            respectiveBucket = "wx-user-cover-pic";
            break;
    }

    if (process.env.NODE_ENV !== 'production') {
        respectiveBucket = `${respectiveBucket}-qa-dev-test`
    }

    uploadAWS(respectiveBucket).single("upload")(req, res, next);
    req.query.bucket = respectiveBucket;

};

uploadsRoutes.post('/image-local', upload.single("upload"), api.http(filesUploads.uploadImage));
uploadsRoutes.post('/image', customMiddleWare, api.http(filesUploads.uploadFileToAWS));

export default uploadsRoutes;
