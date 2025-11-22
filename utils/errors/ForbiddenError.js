const FORBIDDEN_STATUS_CODE = 409;

class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.statusCode = FORBIDDEN_STATUS_CODE;
  }
}

module.exports = ForbiddenError;