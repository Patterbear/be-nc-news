const format = require('pg-format');
const db = require('../db/connection');

exports.removeCommentById = (comment_id) => {
    const query = format('DELETE FROM comments WHERE comment_id = %L RETURNING *;', comment_id);

    return db.query(query)
    .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({ status: 404, msg: 'not found' });
        }
        return result.rows[0];
      });
}

exports.updateCommentById = (comment_id, commentUpdate) => {
  if(!commentUpdate.inc_votes) {
      commentUpdate.inc_votes = 0;
  }

  const query =
    `UPDATE comments
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING *;`;

  return db.query(query, [commentUpdate.inc_votes, comment_id])
  .then((result) => {
    if(result.rows.length !== 0) {
      return result.rows[0];
    } else {
      return Promise.reject({status: 404, msg: 'not found'});
    } 
  });
};