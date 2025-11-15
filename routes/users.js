const usersRouter = require('express').Router();
const auth = require('../middlewares/auth');
const { createUser, getCurrentUser, loginUser, updateUser } = require('../controllers/users');

usersRouter.get('/me', auth, getCurrentUser);
usersRouter.post('/signup', createUser);
usersRouter.post('/signin', loginUser);
usersRouter.patch("/me", auth, updateUser);

module.exports = usersRouter;