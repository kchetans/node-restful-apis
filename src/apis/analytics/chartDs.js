let ui_engine = require("ui-schema");
let mongojs   = require('mongojs');
let $         = require('_includes');
let validate  = require('./chartDataValidator');

let data1 = [
    {
        "color": "#39C558",
        "data" : 60,
        "label": "Coffee"
    }, {
        "color": "#00b4ff",
        "data" : 90,
        "label": "CSS"
    }, {
        "color": "#FFBE41",
        "data" : 50,
        "label": "LESS"
    }, {
        "color": "#ff3e43",
        "data" : 80,
        "label": "Jade"
    }, {
        "color": "#937fc7",
        "data" : 116,
        "label": "AngularJS"
    }
];


let data2 = [
    {
        "label": "Uniques",
        "color": "#768294",
        "data" : [
            ["Mar", 70],
            ["Apr", 85],
            ["May", 59],
            ["Jun", 93],
            ["Jul", 66],
            ["Aug", 86],
            ["Sep", 60]
        ]
    }, {
        "label": "Recurrent",
        "color": "#1f92fe",
        "data" : [
            ["Mar", 21],
            ["Apr", 12],
            ["May", 27],
            ["Jun", 24],
            ["Jul", 16],
            ["Aug", 39],
            ["Sep", 15]
        ]
    }];


let aa = {

    async get1(object, options){
        let {chartCode} = options.params;

        let dd = validate.validateChatData(chartCode, data1);
        console.log("dd => ", dd, chartCode);

        switch (chartCode) {
            case 'donut':
            case 'pie':
                return data1;

            case  "spline":
            case  "area":
            case  "line":
            case  "statcked":
            case  "bar":
                return data2;
        }
    },


    async get2(){
        return [{
            "label": "High Traffic",
            "color": "#b53cff",
            "data" : [
                ["Mar", 90],
                ["Apr", 85],
                ["May", 59],
                ["Jun", 33],
                ["Jul", 66],
                ["Aug", 96],
                ["Sep", 50]
            ]
        }, {
            "label": "Low Range",
            "color": "#73df03",
            "data" : [
                ["Mar", 21],
                ["Apr", 2],
                ["May", 27],
                ["Jun", 4],
                ["Jul", 16],
                ["Aug", 9],
                ["Sep", 15]
            ]
        }];
    },


    async get3(){
        return [{
            "label": "Uniques",
            "color": "#111194",
            "data" : [
                ["Mar", 70],
                ["Apr", 85],
                ["May", 59],
                ["Jun", 3],
                ["Jul", 66],
                ["Aug", 36],
                ["Sep", 60]
            ]
        }, {
            "label": "Recurrent",
            "color": "#fefc33",
            "data" : [
                ["Mar", 21],
                ["Apr", 16],
                ["May", 24],
                ["Jun", 29],
                ["Jul", 86],
                ["Aug", 39],
                ["Sep", 5]
            ]
        }];
    },


    async get4(){
        return [{
            "label": "Uniques",
            "color": "#5b2194",
            "data" : [
                ["Mar", 70],
                ["Apr", 15],
                ["May", 59],
                ["Jun", 3],
                ["Jul", 16],
                ["Aug", 36],
                ["Sep", 10]
            ]
        }, {
            "label": "Recurrent",
            "color": "#c980a1",
            "data" : [
                ["Mar", 11],
                ["Apr", 16],
                ["May", 14],
                ["Jun", 29],
                ["Jul", 46],
                ["Aug", 9],
                ["Sep", 5]
            ]
        }];
    },

    async get5(){
        return [{
            "color": "#39C558",
            "data" : 60,
            "label": "Coffee"
        }, {
            "color": "#00b4ff",
            "data" : 90,
            "label": "CSS"
        }, {
            "color": "#FFBE41",
            "data" : 50,
            "label": "LESS"
        }, {
            "color": "#ff3e43",
            "data" : 80,
            "label": "Jade"
        }, {
            "color": "#937fc7",
            "data" : 116,
            "label": "AngularJS"
        }];
    }

};

export default aa;
