const { deleteCommentById, patchCommentById } = require('../controllers/comments.controllers');
const commentsRouter = require('express').Router();


commentsRouter
    .route('/:comment_id')
    .delete((req, res, next) => {
        deleteCommentById(req, res, next);
    })
    .patch((req, res, next) => {
        patchCommentById(req, res, next);
    });


module.exports = commentsRouter;
