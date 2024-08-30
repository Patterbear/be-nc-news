const apiRouter = require('express').Router();
const { getApi } = require('../controllers/api.controllers');
const topicsRouter = require('./topics-router');
const articlesRouter = require('./articles-router');
const commentsRouter = require('./comments-router');
const usersRouter = require('./users-router');


apiRouter.get('/', (req, res, next) => {
    getApi(req, res, next);
});

apiRouter.use('/topics', topicsRouter);

apiRouter.use('/articles', articlesRouter);

apiRouter.use('/comments', commentsRouter);

apiRouter.use('/users', usersRouter);


module.exports = apiRouter;
