const { getTopics } = require('../controllers/topics.controllers');
const topicsRouter = require('express').Router();


topicsRouter.get('/', (req, res, next) => {
    getTopics(req, res, next);
});


module.exports = topicsRouter;
