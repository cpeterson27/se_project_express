const BAD_REQUEST_STATUS_CODE = 400;

class BadRequestError extends Error {
  constructor(message = "Bad Request") {
    super(message);
    this.statusCode = BAD_REQUEST_STATUS_CODE;
  }
}

module.exports = BadRequestError;