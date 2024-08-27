const db = require('../db/connection');
const format = require('pg-format');
const articles = require('../db/data/test-data/articles');

exports.selectArticleById = (article_id) => {
    let query = 'SELECT * FROM articles WHERE article_id = %L;';

    query = format(query, article_id);

    return db.query(query)
    .then((result) => {
        if(result.rows.length !== 0) {
            return result.rows[0];
        } else {
            return Promise.reject({status: 404, msg: 'not found'});
        }
    })
}

exports.selectArticles = () => {
    const query = `
        SELECT articles.article_id,
        articles.title,
        articles.topic,
        articles.author,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COUNT(comments.article_id) AS comment_count
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;`

    return db.query(query)
    .then((result) => {
        // cast 'comment_count' to number
        for(article of result.rows) {
            article.comment_count = parseInt(article.comment_count);
        }

        return result.rows;
    });
}