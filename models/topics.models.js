const db = require('../db/connection');
const format = require('pg-format');

exports.selectTopics = () => {
    return db.query('SELECT * FROM topics;')
    .then((result) => {
        return result.rows;
    })
}

exports.insertTopic = (topic) => {

    const formattedTopic = [
        topic.description,
        topic.slug
    ];

    const query = format(`
        INSERT INTO topics(description, slug)
        VALUES (%L)
        RETURNING *`,
        formattedTopic
    );

    return db.query(query)
    .then((result) => {
        return result.rows[0];
    });
}