const router = require('express').Router();
const { getItems, createItem, getItem, deleteItem } = require('../controllers/clothingItems');
const { likeItem, dislikeItem } = require('../controllers/likes');

router.get('/', getItems);
router.get('/:itemId', getItem);
router.post('/', createItem);
router.delete('/:itemId', deleteItem )

router.put('/:itemId/likes', likeItem);
router.delete('/:itemId/likes', dislikeItem);

module.exports = router;