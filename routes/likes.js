const router = require('express').Router();
const { likeItem, dislikeItem } = require('../controllers/likes');


router.put('/items/:itemId/likes', likeItem); // like an item
router.delete('/items/:itemId/likes', dislikeItem); // unlike an item

module.exports = router;