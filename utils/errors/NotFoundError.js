const NOT_FOUND_STATUS_CODE = 404;

class NotFoundError extends Error {
  constructor(message ="Not Found") {
    super(message);
    this.statusCode = NOT_FOUND_STATUS_CODE;
  }
}

module.exports = NotFoundError;