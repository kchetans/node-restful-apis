import controller from "./controller";
var siteRouter = require('express').Router();

siteRouter.use('/job/:id', controller.jobDetail);
siteRouter.use('/profile/:id', controller.profileDetail);
siteRouter.use('/review/:id', controller.submitReview);

export default siteRouter;

