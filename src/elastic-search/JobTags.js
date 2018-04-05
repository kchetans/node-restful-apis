import {init as elastic} from "../elastic-search";
import JobUiManager from "../ui-manager/jobs";
let elasticClient = elastic();

export const getJobSearchTags = async (q) => {
    let response = await elasticClient.search({
        index: 'job_postingss',
        type: 'job_postings',
        body: {
            query: {
                "multi_match": {
                    "query": q,
                    "fields": [
                        "description.jd_autocomplete^10",
                        "category.jd_autocomplete^5",
                        "city.edge_ngrams"
                    ]
                }
            },
            "aggs": {
                "city_field": {
                    "filter": {
                        "match": {
                            "city.edge_ngrams": q
                        }
                    },
                    "aggs": {
                        "city": {
                            "terms": {
                                "field": "city.raw"
                            }
                        }
                    }
                },
                "category_field": {
                    "filter": {
                        "match": {
                            "category.jd_autocomplete": q
                        }
                    },
                    "aggs": {
                        "category": {
                            "terms": {
                                "field": "category.raw"
                            }
                        }
                    }
                },
                "job_description": {
                    "filter": {
                        "match": {
                            "description.jd_autocomplete": q
                        }
                    },
                    "aggs": {
                        "job_description": {
                            "terms": {
                                "field": "description.raw"
                            }
                        }
                    }
                }
            }
        }
    });

    let {aggregations} = response;
    let {category_field, city_field} = aggregations;
    let data = [];

    data = _.map(category_field.category.buckets, category => {
        return JobUiManager.getCategoryDisplayText(category.key);
    });

    _.map(city_field.city.buckets, category => {
        data.push(category.key);
    });

    return data;
};