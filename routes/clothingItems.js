const clothingItemsRouter = require('express').Router();
const auth = require('../middlewares/auth');
const { validateClothingItem, validateId } = require('../middlewares/validation');

const { getItems, createItem, getItem, deleteItem } = require('../controllers/clothingItems');
const { likeItem, dislikeItem, getItemLikes } = require('../controllers/likes');

clothingItemsRouter.put('/:id/likes', auth, validateId, likeItem);
clothingItemsRouter.delete('/:id/likes', auth, validateId, dislikeItem);
clothingItemsRouter.get('/:id/likes', auth, validateId, getItemLikes);

clothingItemsRouter.get('/', getItems);
clothingItemsRouter.post('/', auth, validateClothingItem, createItem);
clothingItemsRouter.delete('/:id', auth, validateId, deleteItem);
clothingItemsRouter.get('/:id', auth, validateId, getItem);

module.exports = clothingItemsRouter;