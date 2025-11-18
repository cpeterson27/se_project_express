const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const {
  sendBadRequest,
  sendNotFound,
  sendInternalError,
  sendCreate,
  sendSuccess,
  sendAccessDenied,
} = require("../utils/errors");

// CREATE - POST
const createItem = async (req, res) => {
  try {
    const { name, weather, imageUrl } = req.body;
    const owner = req.user._id;

    const item = await ClothingItem.create({ name, weather, imageUrl, owner });
    return sendCreate(res, item.toJSON());
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return sendBadRequest(res, "Validation Failed");
    }
    return sendInternalError(res, "An error has occurred on the server");
  }
};

// READ - GET
const getItemList = async (req, res) => {
  try {
    const items = await ClothingItem.find()
    return res.status(200).send(items);
  } catch (err) {
    console.error(err);
    if (err.name === "DocumentNotFoundError") {
      return sendNotFound(res, "Item not found");
    }
    if (err.name === "CastError") {
      return sendBadRequest(res, "Invalid item ID format");
    }
    return sendInternalError(res, "An error has occurred on the server");
  }
};

// READ - GET
const getItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await ClothingItem.findById(id).orFail().lean();

    const userId = req.user._id;
    if (item.owner.toString() !== userId) {
      return sendAccessDenied(res, "Access denied");
    }
    return sendSuccess(res, item);
  } catch (err) {
    console.error(err);
    if (err.name === "DocumentNotFoundError") {
      return sendNotFound(res, "Item not found");
    }
    if (err.name === "CastError") {
      return sendBadRequest(res, "Invalid item ID format");
    }
    return sendInternalError(res, "An error has occurred on the server");
  }
};

// UPDATE - PATCH
const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, weather, imageUrl } = req.body;
    const userId = req.user._id;

    const item = await ClothingItem.findById(id).orFail().lean();

    if (item.owner.toString() !== userId) {
      return sendAccessDenied(res, "Access denied");
    }

    const updatedItem = await ClothingItem.findByIdAndUpdate(
      id,
      { name, weather, imageUrl },
      { new: true, runValidators: true }
    )
      .orFail()
      .lean();
    return sendSuccess(res, updatedItem);
  } catch (err) {
    console.error(err);
    if (err.name === "DocumentNotFoundError") {
      return sendNotFound(res, "Item not found");
    }
    if (err.name === "ValidationError") {
      return sendBadRequest(res, "Validation Failed");
    }
    if (err.name === "CastError") {
      return sendBadRequest(res, "Invalid item ID format");
    }
    return sendInternalError(res, "An error has occurred on the server");
  }
};

// DELETE - DELETE
const removeItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendBadRequest(res, "Invalid item ID format");
    }

    const item = await ClothingItem.findById(id)
    .orFail()
    .lean();

    if (item.owner.toString() !== userId) {
      return sendAccessDenied(res, "Access denied");
    }
    const deletedItem = await ClothingItem.findByIdAndDelete(id)
    .lean();

    return sendSuccess(res, deletedItem);
  } catch (err) {
    console.error(err);
    if (err.name === "DocumentNotFoundError") {
      return sendNotFound(res, "Item not found");
    }
    if (err.name === "CastError") {
      return sendBadRequest(res, "Invalid item ID format");
    }
    return sendInternalError(res, "An error has occurred on the server");
  }
};
module.exports = { getItemList, createItem, getItem, removeItem, updateItem };
