const router = require('express').Router();
const { register, login } = require('../controllers/users');
const { validateUserBody, validateAuthentication } = require('../middlewares/validation')

router.post('/signup', validateUserBody, register);
router.post('/signin', validateAuthentication, login);

module.exports = router;