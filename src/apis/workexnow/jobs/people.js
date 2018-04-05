import JobApplicationDataManager from "../../../data-manager/JobApplicationDataManger";
import UserProfileDataManager from "../../../data-manager/UserProfileDataManager";
import RecomendedUsersDataManager from "../../../data-manager/RecomendedUsers";
import JobsUiManager from "../../../ui-manager/jobs";
import {PAGE_NO, PAGE_SIZE} from "../../../constants/application";
import {init as elastic} from "../../../elastic-search";
import {getPeopleSearch} from "../../../elastic-search/PeopleSearch";
let elasticClient = elastic();

let people = {

    async getPeoples(object, options){
        let {user} = options;
        let data = [];
        let {job_id, state, pageSize = PAGE_SIZE, pageNo = PAGE_NO, q = ''} = options.query;
        if (q === '') {
            q = undefined;
        }
        let peoples = [];
        let attributes = ["_id", "cover_pic_url", "name", "status", "profile_pic_url", 'company_name', 'total_experience', 'education'];

        if (state === 'recommended' && job_id) {
            let recommendedUsers = await RecomendedUsersDataManager.getRecommendedUsers(job_id, {pageNo, pageSize});
            let candidates = await UserProfileDataManager.find({_id: {$in: recommendedUsers}}, attributes);
            data = _.map(candidates, people => JobsUiManager.getEmployerPeopleCard(people));
        }
        else if (job_id && state) {
            peoples = await JobApplicationDataManager.getPeopleForJobs(job_id, state, {pageSize, pageNo});
            data = _.map(peoples, people => JobsUiManager.getEmployerPeopleCardFromApplication(people));
        }
        else {
            // when hit comes form people tab
            let userElastic = true;
            if (userElastic && q && q.length > 1) {
                peoples = await getPeopleSearch(q,{pageSize, pageNo});
                // filter my self
                peoples = _.filter(peoples, people => people._id !== user._id.toHexString());
                data = _.map(peoples, people => JobsUiManager.getEmployerPeopleCard(people));
            } else {
                peoples = await UserProfileDataManager.getPeople(q, attributes, {pageSize, pageNo});
                peoples = _.filter(peoples, people => people._id.toHexString() !== user._id.toHexString());
                data = _.map(peoples, people => JobsUiManager.getEmployerPeopleCard(people));
            }
        }

        return {
            data: {
                people: data,
                meta: {
                    pageSize, pageNo
                }
            }
        }
    },


    async getPeoplesElastic(object, options){
        let {job_id, state, pageSize = PAGE_SIZE, pageNo = PAGE_NO, q = ''} = options.query;
        let data = [];

        try {
            data = await elasticClient.search({
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
                        }
                    }
                }
            });
            // data = data.hits.hits;
        } catch (err) {

        }

        return {
            data,
            message: "We are working on this"
        }
    }

};

export default people;