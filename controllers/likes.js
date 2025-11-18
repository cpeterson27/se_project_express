const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const {
  sendInternalError,
  sendBadRequest,
  sendNotFound,
} = require("../utils/errors");

// CREATE - Add a like (like an item)
module.exports.addCardLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendBadRequest(res, "Invalid ID format");
    }

    // Convert userId to ObjectId if it's a string
    const userObjectId = typeof userId === 'string'
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    const item = await ClothingItem.findByIdAndUpdate(
      id,
      { $addToSet: { likes: userObjectId } },
      { new: true }
    )
      .orFail()
      .lean();

    return res.status(200).send(item);
  } catch (err) {
    console.error(err);
    if (err.name === "DocumentNotFoundError") {
      return sendNotFound(res, "Item not found");
    }
    if (err.name === "CastError") {
      return sendBadRequest(res, "Invalid ID format");
    }
    return sendInternalError(res, "An error has occurred on the server");
  }
};

// READ - Get all users who liked an item
module.exports.getItemLikes = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendBadRequest(res, "Invalid ID format");
    }

    const item = await ClothingItem.findById(id)
      .select("likes")
      .populate("likes", "name avatar")
      .orFail()
      .lean();

    return res.status(200).send(item.likes);
  } catch (err) {
    console.error(err);
    if (err.name === "DocumentNotFoundError") {
      return sendNotFound(res, "Item not found");
    }
    if (err.name === "CastError") {
      return sendBadRequest(res, "Invalid ID format");
    }
    return sendInternalError(res, "An error has occurred on the server");
  }
};

// DELETE - Remove a like (unlike an item)
module.exports.removeCardLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendBadRequest(res, "Invalid ID format");
    }

    // Convert userId to ObjectId if it's a string
    const userObjectId = typeof userId === 'string'
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    const item = await ClothingItem.findByIdAndUpdate(
      id,
      { $pull: { likes: userObjectId } },
      { new: true }
    )
      .orFail()
      .lean();

    return res.status(200).send(item);
  } catch (err) {
    console.error(err);
    if (err.name === "DocumentNotFoundError") {
      return sendNotFound(res, "Item not found");
    }
    if (err.name === "CastError") {
      return sendBadRequest(res, "Invalid ID format");
    }
    return sendInternalError(res, "An error has occurred on the server");
  }
};