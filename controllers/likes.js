const ClothingItem = require("../models/clothingItem");
const {
  INTERNAL_SERVER_ERROR_STATUS_CODE,
  BAD_REQUEST_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
} = require("../utils/errors");

module.exports.likeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

ClothingItem.findByIdAndUpdate(
itemId,
{ $addToSet: { likes: userId }},
{new: true}
)
.orFail()
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError') {
        return res
        .status(BAD_REQUEST_STATUS_CODE)
        .send({message: "Invalid data"});
      } if (err.name === 'DocumentNotFoundError') {
        return res
        .status(NOT_FOUND_STATUS_CODE)
        .send({message: "Item not found"});
      } if (err.name === 'CastError') {
        return res
        .status(BAD_REQUEST_STATUS_CODE)
        .send({message: "Invalid item ID"});
      }

        return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({message: "Something went wrong"});
    });
  };

module.exports.dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
  .orFail()
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError') {
        return res
        .status(BAD_REQUEST_STATUS_CODE)
        .send({message: "Invalid data"});
      } if (err.name === 'DocumentNotFoundError') {
        return res
        .status(NOT_FOUND_STATUS_CODE)
        .send({message: "Item not found"});
      } if (err.name === 'CastError') {
        return res
        .status(BAD_REQUEST_STATUS_CODE)
        .send({message: "Invalid item ID"});
      }
        return res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).send({message: "Something went wrong"});
    });
  }
