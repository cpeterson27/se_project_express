const INTERNAL_SERVER_ERROR_STATUS_CODE = 500;

class InternalServerError extends Error {
  constructor(message = "Internal Server Error") {
    super(message);
    this.statusCode = INTERNAL_SERVER_ERROR_STATUS_CODE;
  }
}

module.exports = InternalServerError;