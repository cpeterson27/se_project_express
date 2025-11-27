const router = require('express').Router();
const { register, login } = require('../controllers/users');
const { validateSignUp, validateAuthentication } = require('../middlewares/validation')

router.post('/signup', validateSignUp, register);
router.post('/signin', validateAuthentication, login);

module.exports = router;