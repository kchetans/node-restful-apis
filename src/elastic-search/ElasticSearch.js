/**
 * Elastic search Wrapper class
 */
import elasticsearch from "elasticsearch";
import config from "config";
import chalk from "chalk";
const elasticLookup = require('./es-query-builder');
const errors = require('../errors');
export default  class ElasticSearch {

    constructor(opts = {}) {
        // increase indexing operation timeout
        this.INDEX_TIMEOUT = '1m';

        // client for interacting with ES
        this.client = new elasticsearch.Client(_.clone(config.elastic));
    }

    // return the elastic client object
    getClient() {
        return this.client;
    };

    // Check if index has been created or not
    checkIndex(indexName) {
        return this.indexExists(indexName)
            .then(found => found ? Promise.resolve() : Promise.reject(new errors.InternalServerError('Index not created.')));
    };

    // checks if index exists or not
    indexExists(indexName) {
        return new Promise((resolve, reject) => {
            this.client.indices.exists({index: indexName}, (err, found) => {
                if (err) reject(err);
                resolve(found);
            });
        });
    };

    //refresh index
    refreshIndex(indexName) {
        return this.checkIndex(indexName).then(() => {
            return Promise.resolve(this.client.indices.refresh({index: indexName}));
        });
    };


    /**
     * Delete index if it exists
     * @param indexName
     * @returns {*|Promise|Promise.<TResult>}
     */
    deleteIndexresetIndex(indexName) {
        return this.indexExists(indexName).then((indexFound) => {
            return indexFound
                ? this.client.indices.delete({
                    index: indexName
                })
                : Promise.resolve(true);
        }).then(() => {
            return Promise.resolve(true);
        });
    };

    // Create the index
    createIndex(indexName) {
        return Promise.resolve(this.client.indices.create({
            index: indexName
        }));
    };


    // open the index
    openIndex(indexName) {
        return Promise.resolve(this.client.indices.open({index: indexName}));
    };

    // close the index
    closeIndex(indexName) {
        return Promise.resolve(this.client.indices.close({
            index: indexName
        }));
    };


    /**
     * Update current setting for the given index
     * @param indexName
     * @param settingJson
     * @returns {*|Promise}
     */
    updateSetting(indexName, settingJson) {
        return this.checkIndex(indexName).then(() => this.closeIndex(indexName)).then(() => {
            // initialize the settings
            return this.client.indices.putSettings({
                index: indexName,
                timeout: this.INDEX_TIMEOUT,
                body: settingJson
            });
        }).finally(() => {
            // open index in case of error
            return this.openIndex(indexName);
        });
    };


    /**
     * Update current mapping for the given index
     * @param indexName
     * @param indexType
     * @param mappingJson
     */
    updateMapping(indexName, indexType, mappingJson) {
        return this.checkIndex(indexName).then(() => this.closeIndex(indexName)).then(() => {
            // initialize the settings
            return this.client.indices.putMapping({
                index: indexName,
                type: indexType,
                timeout: this.INDEX_TIMEOUT,
                body: mappingJson
            });
        }).finally(() => {
            // open index in case of error
            return this.openIndex(indexName);
        });
    };


    /**
     * Initialize the settings for the index
     * @param indexName
     * @param indexType
     * @param settingJson
     * @param mappingJson
     * @returns {*|Promise|Promise.<TResult>}
     */
    initializeIndex = co(function*(indexName, indexType, settingJson, mappingJson) {
        let isAlreadyCreated = yield this.indexExists(indexName);
        if (isAlreadyCreated) throw new errors.BadRequestError("Index already created.");
        else {
            try {
                // create index in elastic search
                yield this.createIndex(indexName);
                yield Promise.delay(1000);

                // first close the index before doing anything
                yield this.closeIndex(indexName);

                // initialize the settings
                console.log('Generating settings');
                yield this.client.indices.putSettings({
                    index: indexName,
                    timeout: this.INDEX_TIMEOUT,
                    body: settingJson
                });
                // Initialize the mapping for the index
                console.log('Generating Mapping');
                yield this.client.indices.putMapping({
                    index: indexName,
                    type: indexType,
                    timeout: this.INDEX_TIMEOUT,
                    body: mappingJson
                });
            } finally {
                // open index in case of error
                yield this.openIndex(indexName);
            }
        }
    });

    /**
     * Search for content based on the search query passed in
     * @param searchQuery
     * @param options
     * @returns {*}
     */
    lookupContent(searchQuery, options) {
        // copy the query object
        let rawQuery = coreUtils.clone(searchQuery);
        // build elastic query from raw query
        let esQuery = elasticLookup.buildQueryBody(rawQuery);
        let indexName = options.indexName;
        let indexType = options.indexType;

        let sortByDate = options.sortByDate;

        console.log(JSON.stringify(rawQuery));
        console.log(JSON.stringify(esQuery));
        console.log(chalk.green(`${indexName} : ${indexType}`));

        return this.client.search({
            index: indexName,
            type: indexType,
            body: esQuery
        }).then(function (resp) {
            let hits = resp.hits.hits,
                dataToReturn = [];
            _.forEach(hits, (elasticHits) => {
                // if not a filter only query, then take score with a min threshold
                dataToReturn.push(filterDocument(rawQuery, elasticHits._source));
            });

            if (sortByDate) {
                // sort documents returned by their date
                dataToReturn.sort(function (doc1, doc2) {
                    // Turn your strings into dates, and then subtract them
                    // to get a value that is either negative, positive, or zero.
                    return new Date(doc2.publishedAt) - new Date(doc1.publishedAt);
                });
            }
            return dataToReturn
        }).then((data) => {
            return Promise.resolve(data);
        }).catch((err) => {
            console.log(chalk.red(`error : ${JSON.stringify(err)}`));
        });
    };

}
