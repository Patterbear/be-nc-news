const db = require('../db/connection');
const format = require('pg-format');

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
        COUNT(comments.article_id)::INTEGER AS comment_count
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;`

    return db.query(query)
    .then((result) => {
        return result.rows;
    });
}

exports.selectCommentsByArticleId = (article_id) => {
    const query = format(`SELECT * FROM comments WHERE article_id = %L ORDER BY created_at DESC`, article_id);

    return db.query(query)
    .then((result) => {
        return result.rows;
    });
}