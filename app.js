const express = require('express');
const { getTopics } = require('./controllers/topics.controllers');
const { getApi } = require('./controllers/api.controllers');
const { getArticleById, getArticles, getCommentsByArticleId, postCommentByArticleId, patchArticleById } = require('./controllers/articles.controllers');


const app = express();

app.use(express.json());

app.get('/api', getApi);

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.post('/api/articles/:article_id/comments', postCommentByArticleId);

app.patch('/api/articles/:article_id', patchArticleById);

app.use((err, req, res, next) => {
    if(err.code === '22P02') {
        res.status(400).send({msg: 'bad request'});
    }else if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        console.log(err)
        next(err);
    }
});

module.exports = app;