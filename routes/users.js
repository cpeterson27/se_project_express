const router = require('express').Router();
const { getUsers, createUser, getUser } = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/', createUser); // POST to http://localhost:3001/users

module.exports = router;