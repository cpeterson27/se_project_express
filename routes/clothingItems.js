const clothingItemsRouter = require("express").Router();
const auth = require("../middlewares/auth");
const {
  validateClothingItem,
  validateId,
} = require("../middlewares/validation");

const {
  getItemList,
  createItem,
  getItem,
  removeItem,
} = require("../controllers/clothingItems");
const {
  addCardLike,
  removeCardLike,
  getItemLikes,
} = require("../controllers/likes");

clothingItemsRouter.put("/:id/likes", auth, validateId, addCardLike);
clothingItemsRouter.delete("/:id/likes", auth, validateId, removeCardLike);
clothingItemsRouter.get("/:id/likes", auth, validateId, getItemLikes);

clothingItemsRouter.get("/", auth, getItemList);
clothingItemsRouter.post("/", auth, validateClothingItem, createItem);
clothingItemsRouter.delete("/:id", auth, validateId, removeItem);
clothingItemsRouter.get("/:id", auth, validateId, getItem);

module.exports = clothingItemsRouter;
