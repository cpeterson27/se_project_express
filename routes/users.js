const usersRouter = require('express').Router();
const auth = require('../middlewares/auth');
const { createUser, getCurrentUser, loginUser, updateUser } = require('../controllers/users');
const { validateUserBody, validateAuthentication } = require('../middlewares/validation');

usersRouter.get('/me', auth, getCurrentUser);
usersRouter.post('/signup', validateUserBody, createUser);
usersRouter.post('/signin', validateAuthentication, loginUser);
usersRouter.patch("/me", auth, updateUser);

module.exports = usersRouter;