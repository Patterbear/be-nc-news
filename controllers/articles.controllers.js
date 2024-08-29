const { selectArticleById, selectArticles, selectCommentsByArticleId, insertCommentByArticleId, updateArticleById } = require('../models/articles.models');

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;

    selectArticleById(article_id)
    .then((article) => {
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

    return Promise.all([selectArticleById(article_id), selectCommentsByArticleId(article_id)])
    .then((results) => {
        res.status(200).send({comments: results[1]});
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

exports.patchArticleById = (req, res, next) => {
    const { article_id } = req.params;
    const articleUpdate = req.body;

    updateArticleById(article_id, articleUpdate)
    .then((article) => {
        res.status(200).send({article});
    })
    .catch((err) => {
        next(err);
    });
}