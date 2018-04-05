let stats = require('stats-analysis');
let WxMath = require('./arr-stat');
let _ = require('lodash');

let data = [{lat: 12, lon: 1}, {lat: 14, lon: 12}, {lat: 51, lon: 12},
    {lat: 12, lon: 17}, {lat: 10, lon: 14}, {lat: 9, lon: 12},
    {lat: 16, lon: 122}, {lat: 1, lon: 12}];

let latMean = WxMath.mean(data.map(item => item.lat));
let latSd = WxMath.standardDeviation(data.map(item => item.lat));

let lonMean = WxMath.mean(data.map(item => item.lon));
let lonSd = WxMath.standardDeviation(data.map(item => item.lon));

console.log("lonMean", lonMean);
console.log("lonSd", lonSd);

let latOutLiers = WxMath.outliers(data.map(item => item.lat), latMean, latSd);
let lonOutLiers = WxMath.outliers(data.map(item => item.lon), lonMean, lonSd);


let reqPositions = [];
data.map((item, index) => {
    if (latOutLiers[index] && lonOutLiers[index]) {
        reqPositions.push(item);
    }
});

let lat = WxMath.mean(reqPositions.map(reqPosition => reqPosition.lat));
let lon = WxMath.mean(reqPositions.map(reqPosition => reqPosition.lon));

console.log("ll", lat);
console.log("mm", lon);




