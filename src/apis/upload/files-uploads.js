let config = require('config');
import * as errors from "../../errors";
import chalk from "chalk";
let s3Config = config.get('aws').s3;

if (!s3Config) {
    console.log(chalk.red("s3Config not found"));
    s3Config = {}
}
let {region, bucket_name} = s3Config;
let hostUrl = config.get('url');
let filePath = 'public/images/';
let filesUploads = {

    async uploadImage(object, options) {
        const {user, file} = options || {};
        let response;

        if (!file)
            throw  new errors.ValidationError({message: "file is required"});

        let fileUrl = `${hostUrl}public/images/${file.filename}`;
        response = {
            data: {
                url: fileUrl,
                filename: file.filename
            },
            message: "File Upload successfully"
        };
        console.log(response);
        return response;

    },

    async uploadFileToAWS(object, options) {
        let {query} = options;
        let {bucket} = query;

        const {user, file, params} = options || {};
        let {image_name} = params;

        if (!file)
            throw new errors.ValidationError({message: "file is required"});
        if (!image_name)
            throw new errors.ValidationError({message: "image name is required"});

        return {
            data: {
                url: `https://s3.${region}.amazonaws.com/${bucket}/${image_name}`,
                filename: image_name
            },
            message: "File Upload Successfully to AWS"
        }
    }
};

export default  filesUploads;
