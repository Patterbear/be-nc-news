const { getArticleById, getArticles, getCommentsByArticleId, postCommentByArticleId, patchArticleById, postArticle, deleteArticleById } = require('../controllers/articles.controllers');

const articlesRouter = require('express').Router();


articlesRouter
.route('/')
    .get((req, res, next) => {
        getArticles(req, res, next);
    })
    .post((req, res, next) => {
        postArticle(req, res, next);
    });

articlesRouter
    .route('/:article_id')
    .get((req, res, next) => {
        getArticleById(req, res, next);
    })
    .patch((req, res, next) => {
        patchArticleById(req, res, next);
    })
    .delete((req, res, next) => {
        deleteArticleById(req, res, next);
    });

articlesRouter
    .route('/:article_id/comments')
    .get((req, res, next) => {
        getCommentsByArticleId(req, res, next);
    })
    .post((req, res, next) => {
        postCommentByArticleId(req, res, next);
    });


module.exports = articlesRouter;
