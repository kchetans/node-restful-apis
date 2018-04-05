// import config from "config";
import elasticsearch from "elasticsearch";
import config from "config";
import _ from 'lodash';
/** Expose all models */
exports = module.exports;
let elasticConfig = config.get('elastic');
let elasticClient;

let getIndices = () => {

};

export const init = (config) => {
    if (elasticClient)
        return elasticClient;
    elasticConfig = _.assign({}, elasticConfig, config);
    elasticClient = new elasticsearch.Client(elasticConfig);

    elasticClient.ping({
        // ping usually has a 3000ms timeout
        requestTimeout: 1000
    }, (error) => {
        if (error) {
            console.trace('elasticsearch cluster is down!', error);
        } else {
            console.log('All is well');
        }
    });

    elasticClient.cluster.health({}, (err, resp, status) => {
        console.log("Elastic health", resp);
    });
    return elasticClient;
};

