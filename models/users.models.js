const db = require('../db/connection');
const format = require('pg-format');

exports.selectUsers = () => {
    return db.query('SELECT * FROM users;')
    .then((result) => {
        return result.rows;
    });
}

exports.selectUserByUsername = (username) => {
    const query = format(`SELECT * FROM users WHERE username = %L`, username);

    return db.query(query)
    .then((result) => {
        if(result.rows.length !== 0) {
            return result.rows[0];
        } else {
            return Promise.reject({status: 404, msg: 'not found'});
        }
    });

}
