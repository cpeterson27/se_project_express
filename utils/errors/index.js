const BadRequestError = require("./BadRequestError");
const NotFoundError = require("./NotFoundError");
const UnauthorizedError = require("./UnauthorizedError");
const ConflictError = require("./ConflictError");
const InternalServerError = require("./InternalServerError");
const ForbiddenError = require("./ForbiddenError");

module.exports = {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  ConflictError,
  InternalServerError,
  ForbiddenError
};
