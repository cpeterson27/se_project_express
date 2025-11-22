const CONFLICT_STATUS_CODE = 409;

class ConflictError extends Error {
  constructor(message = "Conflict") {
    super(message);
    this.statusCode = CONFLICT_STATUS_CODE;
  }
}

module.exports = ConflictError;