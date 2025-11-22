const usersRouter = require('express').Router();
const auth = require('../middlewares/auth');
const { register, getCurrentUser, login, updateUserInfo } = require('../controllers/users');
const { validateUserBody, validateAuthentication } = require('../middlewares/validation');

usersRouter.get('/debug/all', async (req, res) => {
  try {
    const User = require('../models/user');
    const users = await User.find({}).select('-password');
    res.json({ count: users.length, users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


usersRouter.get('/me', auth, getCurrentUser);
usersRouter.post('/signup', validateUserBody, register);
usersRouter.post('/signin', validateAuthentication, login);
usersRouter.patch("/me", auth, updateUserInfo);

module.exports = usersRouter;