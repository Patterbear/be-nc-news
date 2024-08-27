const express = require('express');
const { getTopics } = require('./controllers/topics.controllers');
const { getApi } = require('./controllers/api.controllers');
const { getArticleById, getArticles, getCommentsByArticleId } = require('./controllers/articles.controllers');


const app = express();

app.get('/api', getApi);

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.use((err, req, res, next) => {
    if(err.code === '22P02') {
        res.status(400).send({msg: 'bad request'});
    }else if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        next(err);
    }
});

module.exports = app;