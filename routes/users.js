const router = require('express').Router();
const { createUser, getCurrentUser, updateUser } = require('../controllers/users');

router.get('/me', getCurrentUser);
router.post('/', createUser); // POST to http://localhost:3001/users
router.patch("/me", updateUser)

module.exports = router;