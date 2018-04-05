import AWS from "aws-sdk";
import * as errors from "../../errors";
import config from "config";
import chalk from "chalk";
let s3Config = config.get('aws').s3;

if (!s3Config) {
    console.log(chalk.red("s3Config not found"));
    s3Config = {};
}

AWS.config.update({
    "accessKeyId": s3Config.accessKeyId,
    "secretAccessKey": s3Config.secretAccessKey,
    "region": s3Config.region
});

let s3 = new AWS.S3();

let s33 = {

    // TODO call on server startup
    createBucketForImages(object, options) {
        let {bucket_name} = s3Config;
        s3.listBuckets((err, data) => {
            if (err)
                throw new errors.ValidationError({message: "Error in listing buckets"});
            let reqBucket = _.find(data.Buckets, {"Name": bucket_name});
            if (!reqBucket) {
                let bucketParams = {Bucket: bucket_name};
                s3.createBucket(bucketParams, (err, data) => {
                    if (err)
                        throw new errors.ValidationError({message: "Error in creating bucket"});
                    return {
                        message: "bucket created"
                    }
                });
            }
            return {
                message: "bucket already exists"
            }
        });
    }

};

export default s33;

