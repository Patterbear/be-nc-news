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