const clothingItemsRouter = require("express").Router();
const auth = require("../middlewares/auth");
const {
  validateClothingItem,
  validateId,
} = require("../middlewares/validation");

const {
  getItemList,
  createItem,
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

clothingItemsRouter.get("/", getItemList);
clothingItemsRouter.post("/", auth, validateClothingItem, createItem);
clothingItemsRouter.delete("/:id", auth, validateId, removeItem);

module.exports = clothingItemsRouter;
