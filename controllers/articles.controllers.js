const articles = require('../db/data/test-data/articles');
const { convertTimestampToDate } = require('../db/seeds/utils');
const { selectArticleById, selectArticles } = require('../models/articles.models');

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;

    selectArticleById(article_id)
    .then((article) => {

        // convert SQL TIMESTAMP using utils method
        article = convertTimestampToDate(article)

        // reordered the properties to match the list on the task - not sure if needed
        const formattedArticle = {
            author: article.author,
            title: article.title,
            article_id: article.article_id,
            body: article.body,
            topic: article.topic,
            created_at: article.created_at,
            votes: article.votes,
            article_img_url: article.article_img_url
        };

        res.status(200).send({article: formattedArticle});
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