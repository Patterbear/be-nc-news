const { removeCommentById, updateCommentById } = require('../models/comments.models');

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params;

    return removeCommentById(comment_id)
    .then(() => {
        res.status(204).send();
    })
    .catch((err) => {
        next(err);
    });
}

exports.patchCommentById = (req, res, next) => {
    const { comment_id } = req.params;
    const commentUpdate = req.body;

    return updateCommentById(comment_id, commentUpdate)
    .then((comment) => {
        res.status(200).send({comment})
    })
    .catch((err) => {
        next(err);
    });
}