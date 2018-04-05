import {init as elastic} from "../elastic-search";
import JobPostingSchema from "../mongo-models/JobPostingSchema";
import currentIndices from "./indices.json";
import fs from "fs";


const path = require('path');
let ROOT_PATH = path.join(__dirname);

let elasticClient = elastic();

let indices = {

    async getIndices(){

    },

    async deleteIndices(){

    },

    indexData (req, res){

        let stream = JobPostingSchema.synchronize();
        let count = 0;
        let startTime = new moment(new Date());

        stream.on('data', function (err, doc) {
            count++;
        });

        stream.on('close', function () {
            console.log("DONE in ", moment.duration(new moment(new Date()).diff(startTime), 'milliseconds').humanize());
        });

        stream.on('error', function (err) {
            console.log(err);
        });


    },

    async updateIndices(req, res){
        let _index = 'user_indices';
        let _type = 'user_profiles';

        try {
            await elasticClient.indices.delete({index: _index});
        } catch (err) {
        }

        await elasticClient.indices.create(currentIndices);

        fs.readFile(path.join(ROOT_PATH, 'sample-users.json'), 'utf8', (err, data) => {
            if (err) throw err;
            let sampleDataSet = JSON.parse(data);
            let body = [];
            sampleDataSet.forEach((item) => {
                body.push({"index": {"_index": _index, "_type": _type}});
                body.push({"name": item.name});
            });
            elasticClient.bulk({
                body: body
            }, function (err, resp) {
                res.send({result: 'Indexing Completed!'});
            })
        });

    },
};

export default  indices;