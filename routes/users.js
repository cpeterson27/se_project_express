const usersRouter = require('express').Router();
const auth = require('../middlewares/auth');
const { register, getCurrentUser, login, updateUserInfo } = require('../controllers/users');
const { validateUserBody, validateAuthentication } = require('../middlewares/validation');

usersRouter.get('/me', auth, getCurrentUser);
usersRouter.post('/signup', validateUserBody, register);
usersRouter.post('/signin', validateAuthentication, login);
usersRouter.patch("/me", auth, updateUserInfo);

module.exports = usersRouter;