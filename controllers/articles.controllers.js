const { selectArticleById, selectArticles, selectCommentsByArticleId, insertCommentByArticleId, updateArticleById, insertArticle, removeArticleById } = require('../models/articles.models');

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
    const { sort_by, order, topic, limit, p } = req.query;

    selectArticles(sort_by, order, topic, limit, p)
    .then((result) => {
        const articles = result[0];
        const total_count = result[1];

        res.status(200).send({articles, total_count});
    })
    .catch((err) => {
        next(err);
    });
}

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const { limit, p } = req.query;

    return Promise.all([selectArticleById(article_id), selectCommentsByArticleId(article_id, limit, p)])
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

    return Promise.all([selectArticleById(article_id), updateArticleById(article_id, articleUpdate)])
    .then((results) => {
        res.status(200).send({article: results[1]});
    })
    .catch((err) => {
        next(err);
    });
}

exports.postArticle = (req, res, next) => {
    const newArticle = req.body;

    insertArticle(newArticle)
    .then((article) => {
        res.status(201).send({article})
    })
    .catch((err) => {
        next(err);
    }); 
}

exports.deleteArticleById = (req, res, next) => {
    const { article_id } = req.params;

    return removeArticleById(article_id)
    .then(() => {
        res.status(204).send();
    })
    .catch((err) => {
        next(err);
    });
}