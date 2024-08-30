const { getUsers, getUserByUsername } = require('../controllers/users.controllers');
const usersRouter = require('express').Router();


usersRouter.get('/', (req, res, next) => {
    getUsers(req, res, next);
});

usersRouter.get('/:username', (req, res, next) => {
    getUserByUsername(req, res, next);
});


module.exports = usersRouter;
