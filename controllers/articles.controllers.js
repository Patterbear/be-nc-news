const { convertTimestampToDate } = require('../db/seeds/utils');
const { selectArticleById, selectArticles, selectCommentsByArticleId, insertCommentByArticleId } = require('../models/articles.models');

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;

    selectArticleById(article_id)
    .then((article) => {
        article = convertTimestampToDate(article)

        res.status(200).send({article});
    })
    .catch((err) => {
        next(err);
    });
}

exports.getArticles = (req, res, next) => {
    selectArticles()
    .then((articles) => {
        res.status(200).send({articles});
    })
    .catch((err) => {
        next(err);
    });
}

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;

    selectArticleById(article_id)
    .then(() => {
        selectCommentsByArticleId(article_id)
        .then((comments) => {
            res.status(200).send({comments});
        })
    })
    .catch((err) => {
        next(err);
    });
}

exports.postCommentByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const newComment = req.body;

    insertCommentByArticleId(article_id, newComment)
    .then((comment) => {
        res.status(201).send({comment})
    })
    .catch((err) => {
        next(err);
    });


}