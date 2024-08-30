const db = require('../db/connection');
const format = require('pg-format');

exports.selectUsers = () => {
    return db.query('SELECT * FROM users;')
    .then((result) => {
        return result.rows;
    });
}
