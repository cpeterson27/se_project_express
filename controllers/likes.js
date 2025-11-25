const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} = require("../utils/errors");

// CREATE - Add a like (like an item)
module.exports.addCardLike = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next (new BadRequestError("Invalid ID format"));
    }

    const userObjectId = typeof userId === 'string'
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    const item = await ClothingItem.findByIdAndUpdate(
      id,
      { $addToSet: { likes: userObjectId } },
      { new: true }
    )
      .orFail(() => new NotFoundError("Item not found"))
      .lean();

    return res.status(200).send(item);
  } catch (err) {
    console.error(err);
    if (err.name === "DocumentNotFoundError") {
      return next (new NotFoundError("Item not found"));
    }
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid ID format"));
    }
    return next(new InternalServerError("An error has occurred on the server"));
  }
};

// READ - Get all users who liked an item
module.exports.getItemLikes = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next (new BadRequestError("Invalid ID format"));
    }

    const item = await ClothingItem.findById(id)
      .select("likes")
      .populate("likes", "name avatar")
      .orFail(() => NotFoundError("Item not found"))
      .lean();

    return res.status(200).send(item.likes);
  } catch (err) {
    console.error(err);
    if (err.name === "DocumentNotFoundError") {
      return next (new NotFoundError("Item not found"));
    }
    if (err.name === "CastError") {
      return next (new BadRequestError("Invalid ID format"));
    }
    return (new InternalServerError("An error has occurred on the server"));
  }
};

// DELETE - Remove a like (unlike an item)
module.exports.removeCardLike = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next (new BadRequestError("Invalid ID format"));
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
      return next (new NotFoundError("Item not found"));
    }
    if (err.name === "CastError") {
      return next (new BadRequestError("Invalid ID format"));
    }
    return next (new InternalServerError("An error has occurred on the server"));
  }
};