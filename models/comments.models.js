const format = require('pg-format');
const db = require('../db/connection');

exports.removeCommentById = (comment_id) => {
    const query = format('DELETE FROM comments WHERE comment_id = %L RETURNING *', comment_id);

    return db.query(query)
    .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({ status: 404, msg: 'not found' });
        }
        return result.rows[0];
      });
}