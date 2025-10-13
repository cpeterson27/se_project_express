const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,
  CREATED_STATUS_CODE,
  OK_STATUS_CODE,
  ACCESS_DENIED_STATUS_CODE
} = require("../utils/errors");

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error has occured on the server" });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res
    .status(CREATED_STATUS_CODE)
    .send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Input validation" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error has occured on the server" });
    });
};

const getItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
  .orFail()
    .then((item) => res
    .status(OK_STATUS_CODE)
    .send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res
        .status(BAD_REQUEST_STATUS_CODE)
        .send({ message: "Invalid format" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error has occured on the server" });
    });
};

const deleteItem = (req, res) => {
    const { itemId } = req.params;
    const userId = req.user._id;

ClothingItem.findByIdAndDelete(itemId)
  .orFail()
  .then((item) => {
    if (item.owner.toString() !== userId) {
      return res
        .status(ACCESS_DENIED_STATUS_CODE)
        .send({ message: "Access denied" });
  }
return ClothingItem.findByIdAndDelete(itemId)
.then(() =>
    res
    .status(OK_STATUS_CODE)
    .send({ message: "Item deleted" }))
    .catch((err) => {
      console.error(err);
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res
        .status(BAD_REQUEST_STATUS_CODE)
        .send({ message: "Invalid format" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error has occured on the server" });
    });
})
}
module.exports = { getItems, createItem, getItem, deleteItem };