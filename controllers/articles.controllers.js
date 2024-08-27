const articles = require('../db/data/test-data/articles');
const { convertTimestampToDate } = require('../db/seeds/utils');
const { selectArticleById, selectArticles } = require('../models/articles.models');

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