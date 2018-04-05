let _ = require('lodash');

exports.validateChatData = function (chartCode, data) {
    if (!data instanceof Array) {
        return false
    }
    if (chartCode == 'pie' || chartCode == 'donut') {
        return _.every(data, ({data}) => typeof data == "number")
    } else {
        return _.every(data, ({data}) => data instanceof Array)
    }
};


/**
 FOR pie and donut
 [{
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
 ]



 For other
 [
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
                    }]

 */
