import {init as elastic} from "../elastic-search";
let elasticClient = elastic();

export const getPeopleSearch = async (q, {pageSize, pageNo}) => {
    pageSize = parseInt(pageSize);
    pageNo = parseInt(pageNo);

    let response = await elasticClient.search({
        index: 'user_profiless',
        type: 'user_profiles',
        body: {
            query: {
                "multi_match": {
                    "query": q,
                    "type": "most_fields",
                    "fields": [
                        "full_time_preferences.jd_autocomplete^20",
                        "designation.jd_autocomplete^5",
                        "city.edge_ngrams^10",
                        "name.edge_ngrams^15",
                        "status.shingle^30",
                    ]
                }
            },
            size: pageSize,
            from: pageNo * pageSize
        }
    });

    let {hits = {}} = response;
    let {hits: newHits} = hits;

    return _.map(newHits, item => {
        return Object.assign({}, item._source, {_id: item._id});
    })
};