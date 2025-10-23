const usersRouter = require('express').Router();
const auth = require('../middlewares/auth');
const { createUser, login, getCurrentUser, updateUser } = require('../controllers/users');

usersRouter.get('/users/me', auth, getCurrentUser);
usersRouter.post('/signup', createUser);
usersRouter.post('/signin', login);
usersRouter.patch("/me", auth, updateUser);

module.exports = usersRouter;