let ui_engine = require("ui-schema");
let mongojs   = require('mongojs');
let $         = require('_includes');

let aa = {

    async getMasterCharts(){
        return new Promise((resolve, reject) => {
            $.mdb.collection("master_charts").find({}, (err, docs) => {
                if (err)
                    reject(err);
                resolve(docs);
            });
        })
    },

    async getCharts(){
        return new Promise((resolve, reject) => {
            $.mdb.collection("dashboards_charts_config").findOne({dashboard_code: "test_code"}, (err, docs) => {
                if (err)
                    reject(err);
                resolve(docs);
            });
        })
    },

    async addChart(object, options){
        return new Promise((resolve, reject) => {
            $.mdb.collection("dashboards_charts_config").findAndModify({
                query : {dashboard_code: "test_code"},
                update: {$push: {charts: object}}
            }, (err, docs) => {
                if (err)
                    reject(err);
                resolve(docs);
            });
        })
    }
};

export default aa;
