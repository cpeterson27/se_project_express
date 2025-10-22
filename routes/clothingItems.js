const clothingItemsRouter = require('express').Router();
const auth = require('../middlewares/auth');

const { getItems, createItem, getItem, deleteItem, updateItem } = require('../controllers/clothingItems');
const { likeItem, dislikeItem, getItemLikes } = require('../controllers/likes');

clothingItemsRouter.put('/:id/likes', auth, likeItem);
clothingItemsRouter.delete('/:id/likes', auth, dislikeItem);
clothingItemsRouter.get('/:id/likes', auth, getItemLikes);

clothingItemsRouter.get('/', auth, getItems);
clothingItemsRouter.post('/', auth, createItem);
clothingItemsRouter.delete('/:id', auth, deleteItem);
clothingItemsRouter.patch('/:id', auth, updateItem);
clothingItemsRouter.get('/:id', auth, getItem);

module.exports = clothingItemsRouter;