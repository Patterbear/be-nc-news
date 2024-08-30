const db = require('../db/connection');
const format = require('pg-format');
const { formatComments } = require('../db/seeds/utils');

exports.selectArticleById = (article_id) => {
    let query = `
        SELECT articles.*, COUNT(comments.article_id)::INTEGER AS comment_count
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
        WHERE articles.article_id = %L
        GROUP BY articles.article_id;`

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

exports.selectArticles = (sort_by = 'created_at', order = 'desc', topic, limit = 10, p = 1) => {
    const validSortBys = [
        'article_id',
        'topic',
        'author',
        'created_at',
        'votes',
        'comment_count'
    ];

    if(!validSortBys.includes(sort_by)) {
        return Promise.reject({status: 400, msg: 'bad request'});
    }

    const validOrders = ['asc', 'desc'];

    if(!validOrders.includes(order)) {
        return Promise.reject({status: 400, msg: 'bad request'});
    }

    if(!(Number.isInteger(Number(limit)) && Number(limit) > 0 && Number.isInteger(Number(p)) && Number(p) > 0)) {
        return Promise.reject({status: 400, msg: 'bad request'});
    }

    let query = `
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
        ON articles.article_id = comments.article_id`

    const queryParams = [];

    if(topic) {
        query += `
        WHERE topic = $1`;
        queryParams.push(topic);
    }

    query += `
        GROUP BY articles.article_id,
        articles.title,
        articles.topic,
        articles.author,
        articles.created_at,
        articles.votes,
        articles.article_img_url`;

    return db.query(query, queryParams)
    .then((result) => {
        const total_count = result.rows.length;

        query += `
        ORDER BY ${sort_by} ${order.toUpperCase()}
        LIMIT ${limit}
        OFFSET ${(p - 1) * limit};`

        if(topic) {
            return db.query(`SELECT * FROM topics WHERE slug = $1`, [topic])
            .then((result) => {
                if(result.rows.length === 0) {
                    return Promise.reject({status: 404, msg: 'not found'})
                } else {
                    return db.query(query, queryParams)
                    .then((result) => {
                        return [result.rows, total_count];
                    });
                }
            });
        } else {
            return db.query(query, queryParams)
            .then((result) => {
                return [result.rows, total_count];
            });
        }
    });
    


}

exports.selectCommentsByArticleId = (article_id, limit = 5, p = 1) => {
    const query = format(`
        SELECT * FROM comments
        WHERE article_id = %L
        ORDER BY created_at DESC
        LIMIT ${limit}
        OFFSET ${(p - 1) * limit};`,
        article_id);

    return db.query(query)
    .then((result) => {
        return result.rows;
    });
}

exports.insertCommentByArticleId = (article_id, comment) => {
    comment = formatComments([comment], article_id)[0];

    const formattedComment = [
        comment.body,
        article_id,
        comment.username
    ];

    const query = format(`
        INSERT INTO comments(body, article_id, author)
        VALUES (%L)
        RETURNING *;`,
        formattedComment
    );

    return db.query(query)
    .then((result) => {
        return result.rows[0];
    });
}

exports.updateArticleById = (article_id, articleUpdate) => {
    if(!articleUpdate.inc_votes) {
        articleUpdate.inc_votes = 0;
    }

    const query =
        `UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;`;

    return db.query(query, [articleUpdate.inc_votes, article_id])
    .then((result) => {
        return result.rows[0];
    });
};

exports.insertArticle = (article) => {
    if(!article.article_img_url) {
        article.article_img_url = 'https://pix4free.org/assets/library/2021-08-07/originals/default.jpg'
    }

    const formattedArticle = [
        article.author,
        article.title,
        article.body,
        article.topic,
        article.article_img_url
    ];

    const query = format(`
        INSERT INTO articles(author, title, body, topic, article_img_url)
        VALUES (%L)
        RETURNING *, 0 AS comment_count;`,
        formattedArticle
    );

    return db.query(query)
    .then((result) => {
        return result.rows[0];
    });
}