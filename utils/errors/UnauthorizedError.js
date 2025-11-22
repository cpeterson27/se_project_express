const UNAUTHORIZED_STATUS_CODE = 401;

class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.statusCode = UNAUTHORIZED_STATUS_CODE;
  }
}

module.exports = UnauthorizedError;