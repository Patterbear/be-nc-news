const { getTopics, postTopic } = require('../controllers/topics.controllers');
const topicsRouter = require('express').Router();


topicsRouter
.route('/')
.get((req, res, next) => {
    getTopics(req, res, next);
})
.post((req, res, next) => {
    postTopic(req, res, next);
});


module.exports = topicsRouter;
