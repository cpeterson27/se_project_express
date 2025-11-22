const usersRouter = require('express').Router();
const auth = require('../middlewares/auth');
const {  getCurrentUser, updateUserInfo } = require('../controllers/users');

usersRouter.get('/me', auth, getCurrentUser);
usersRouter.patch("/me", auth, updateUserInfo);

module.exports = usersRouter;