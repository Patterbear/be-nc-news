const { getUsers } = require('../controllers/users.controllers');
const usersRouter = require('express').Router();


usersRouter.get('/', (req, res, next) => {
    getUsers(req, res, next);
});


module.exports = usersRouter;
