const FeederRoutes = require('express').Router();
// import configs from "./configs";
import feederApi from "./api";
var api = require('_includes').api;

/** Feeds API **/
FeederRoutes.get('/feed-page-config', api.http(feederApi.getFeedPageConfig));
FeederRoutes.get('/leftPanel/', api.http(feederApi.leftPannel));
FeederRoutes.get('/rightPanel/', api.http(feederApi.rightPannel));
FeederRoutes.get('/feeds/', api.http(feederApi.getFeeds));
FeederRoutes.post('/feed/', api.http(feederApi.postFeed));
FeederRoutes.get('/feed/', api.http(feederApi.getFeed));

// FeederRoutes.post('/feeds/:userID', api.http(feederApi.postFeeds));

/**
 * You can also write in this way
 * but no middleware support will be provided
 */
FeederRoutes.get('/', (req, res) => {
    res.statusCode = 200;
    res.send("ok");
});

export default FeederRoutes;
