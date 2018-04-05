/**
 * It will be a filter only query when there are no keywords given
 * in the original raw query.
 *
 * @param rawQuery
 */
const _ = require('lodash');
const chalk = require('chalk');
const moment = require('moment');
const config = require('config');
import {PAGE_SIZE} from "../constants/application";
const coreUtils = require('../../utils/util');

const MAX_ARTICLES = PAGE_SIZE;
const DEFAULT_LANGUAGE = 'english';

function isFilterOnlyQuery(rawQuery) {
    let hasKeywordsFilter;
    if (coreUtils.checkNested(rawQuery, 'keywords')) {
        hasKeywordsFilter = rawQuery.keywords.length > 0;
    }
    return !hasKeywordsFilter;
}

/**
 * Check if array is not empty
 * @param array
 * @returns {boolean}
 */
function isArrayNotEmpty(array) {
    return array && array.length > 0;
}

function makeArray(singleItem) {
    if (_.isArray(singleItem)) return singleItem;
    else return [singleItem];
}

/**
 * Create elastic search engine query
 * @param query
 * @returns {{from: number, size: number, query: {}}|*}
 */
function buildQueryBody(query) {

    query = query || {};

    let fullQueryBody, queryClauseRoot
        // sources from which news is to be fetched
        , sourceArray = query.sources
        // specific news item id to be fechted
        , itemId = query.itemId
        // minimum date after which  documents should be fetched
        , minDate = query.minDate
        // origin of time from where score which will be calculated
        , timeOrigin = query.date
        // language of documents
        , language = query.language || DEFAULT_LANGUAGE
        // categories of documents
        , categoryFilters = query.categories || []
        // not of categories of documents
        , excludedCategories = query.excludedCategories || []
        // keywords for the documents
        , keywords = query.keywords || []
        // offset for documents
        , offset = query.offset || 0
        , sort = query.sort;

    let timeScale = '6d',
        // time offset value
        timeOffset = '1d',
        // decay parameter w.r.t. time
        timeDecay = 0.9;

    // set today time if wrong date has been set
    if (!timeOrigin || !coreUtils.checkValidDate(timeOrigin)) {
        timeOrigin = moment().format();
    } else {
        // date has already been set. override time scale
        timeScale = '1d';
    }

    // query body
    fullQueryBody = {
        "from": offset,
        "size": MAX_ARTICLES,
        "query": {
            "function_score": {
                "query": {}
            }
        }
    };

    // value of query key within the body
    queryClauseRoot = {
        // top level bool query which combines category, language etc filters and match filter
        "bool": {
            "should": [],
            // add filter query for filtering approved news having the given language
            "filter": {
                "bool": {
                    "must": [],
                    "must_not": [],
                    "should": [],
                    "filter": []
                }
            }
        }
    };

    // parent clause of the main filter query
    let filerQueryRoot = queryClauseRoot.bool.filter.bool;

    // add language filter
    language = language.toLocaleLowerCase();
    filerQueryRoot.filter.push({
        "term": {
            "language": language
        }
    });

    // add date range query if applied
    if (minDate) {
        // format the value of date which elastic search can understand
        minDate = moment(minDate).format('YYYY-MM-DD');
        filerQueryRoot.filter.push({
            "range": {
                "publishedAt": {
                    "gte": minDate
                }
            }
        });
    }

    // if news-id is defined, directly fetch article by id in that case
    if (!coreUtils.isNullOrUndefined(itemId)) {
        filerQueryRoot.filter.push({
            "term": {
                "itemId": itemId
            }
        });
    }

    // pre-process the list of categories
    categoryFilters = makeArray(categoryFilters);
    categoryFilters = _.map(categoryFilters, (catName) => catName.toLocaleLowerCase());

    excludedCategories = makeArray(excludedCategories);
    excludedCategories = _.map(excludedCategories, (catName) => catName.toLocaleLowerCase());

    // create array of single keyword
    keywords = makeArray(keywords);

    if (isArrayNotEmpty(categoryFilters)) {
        /** using should filter for filtering out categories **/
        /**  minimum categories that should be matched in order for the item to be filtered */
        filerQueryRoot.minimum_should_match = 1;
        _.forEach(categoryFilters, function (catFilter) {
            filerQueryRoot.should.push({
                "term": {"categories": catFilter}
            });
        });
    }

    if (isArrayNotEmpty(excludedCategories)) {
        _.forEach(excludedCategories, function (notCat) {
            filerQueryRoot.must_not.push({
                "term": {"categories": notCat}
            });
        });
    }

    /** check and set source filters */
    if (isArrayNotEmpty(sourceArray)) {
        _.forEach(sourceArray, (sourceName) => {
            filerQueryRoot.must.push({
                "term": {"source": sourceName}
            });
        });
    }

    if (isArrayNotEmpty(keywords)) {
        /**
         * To match the exact sequence of keywords, use phrase query (match_phrase).
         * This can be indicated by the setting 'type' property within the multi_match to 'phrase'.
         *
         * Type 'best_field' is appropriate for our use case as it makes more sense for the news having all
         * keywords present in the same field to be rated a higher score.
         *
         * avg no of sentences in title, summary, text are respectively 1, 6, 18.
         * set boost accordingly.
         *
         */
        let keywordText = _.join(keywords, " ");

        let searchableFields = ["title^18", "summary^6", "description^1"];

        queryClauseRoot.bool.should = [];

        queryClauseRoot.bool.should.push({
            "multi_match": {
                "fields": searchableFields,
                "type": "most_fields",
                "query": keywordText,
                "operator": "or",
                "boost": 2.0
            }
        });

        queryClauseRoot.bool.should.push({
            "multi_match": {
                "fields": searchableFields,
                "type": "most_fields",
                "query": keywordText,
                "operator": "and",
                "fuzziness": "1",
                "boost": 6.0
            }
        });
    }

    fullQueryBody.query.function_score.query = queryClauseRoot;

    fullQueryBody.query.function_score.boost_mode = "multiply";
    fullQueryBody.query.function_score.functions = [{
        "exp": {
            "publishedAt": {
                "origin": timeOrigin,
                "scale": timeScale,
                "offset": timeOffset,
                "decay": timeDecay
            }
        }
    }];

    let sortFilter;
    switch (sort) {
        case "publishedAt" :
            sortFilter = [
                {
                    "publishedAt": {
                        "order": "desc"
                    }
                },
                "_score"
            ];
            break;

        default:
            sortFilter = [
                "_score",
                {
                    "publishedAt": {
                        "order": "desc"
                    }
                }
            ];
            break;
    }
    // specify sort order
    fullQueryBody.sort = sortFilter;

    // apply minimum score criteria if it ain't a filter query
    if (!isFilterOnlyQuery(query)) {
        fullQueryBody.min_score = 0.05;
    }

    return fullQueryBody;
}

module.exports.buildQueryBody = buildQueryBody;