const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/errors");

// CREATE - POST
const createItem = async (req, res, next) => {
  try{
    const { name, weather, imageUrl } = req.body;
    const owner = req.user._id;

    const item = await ClothingItem.create({ name, weather, imageUrl, owner });
    res.status(201).json(item);
  } catch (err) {
    if (err.name === "ValidationError") {
      throw new BadRequestError("Validation Failed");
    }
    next(err);
  }
}

// READ - GET
const getItemList = async (req, res, next) => {
  try {
    const items = await ClothingItem.find({}).lean();
    res.status(200).send(items);
  } catch (err) {
    next(err);
  }
}

// DELETE - DELETE
const removeItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError("Invalid item ID format");
    }

    const item = await ClothingItem.findById(id).lean();
    if (!item) {
      throw new NotFoundError("Item not found");
    }

    if (item.owner.toString() !== userId.toString()) {
      throw new ForbiddenError("Access denied");
    }

    const deletedItem = await ClothingItem.findByIdAndDelete(id).lean();

    return res.status(200).json(deletedItem);
  } catch (err) {
    next(err);
  }
}

module.exports = { getItemList, createItem, removeItem };
