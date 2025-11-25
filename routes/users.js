const usersRouter = require('express').Router();
const { validateUserBody } = require('../middlewares/validation');
const auth = require('../middlewares/auth');
const {  getCurrentUser, updateUserInfo } = require('../controllers/users');

usersRouter.get('/me', auth, getCurrentUser);
usersRouter.patch("/me", auth, validateUserBody, updateUserInfo);

module.exports = usersRouter;