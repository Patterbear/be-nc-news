const { deleteCommentById } = require('../controllers/comments.controllers');
const commentsRouter = require('express').Router();


commentsRouter.delete('/:comment_id', (req, res, next) => {
    deleteCommentById(req, res, next);
});


module.exports = commentsRouter;
