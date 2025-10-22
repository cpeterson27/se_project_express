const BAD_REQUEST_STATUS_CODE = 400;
const NOT_FOUND_STATUS_CODE = 404;
const INTERNAL_SERVER_ERROR_STATUS_CODE = 500;
const CREATED_STATUS_CODE = 201;
const OK_STATUS_CODE = 200;
const CONFLICT_STATUS_CODE = 409;
const UNAUTHORIZED_STATUS_CODE = 401;
const ACCESS_DENIED_STATUS_CODE = 403;

function sendSuccess(res, data = null, message = "Success") {
  return res.status(OK_STATUS_CODE).json({
    message,
    data,
  });
}

function sendCreate(res, data = null, message = "Created") {
  return res.status(CREATED_STATUS_CODE).json({
    message,
    ...data,
  });
}

function sendBadRequest(res, message = "Bad Request") {
  return res.status(BAD_REQUEST_STATUS_CODE).json({
    message,
  });
}

function sendNotFound(res, message = "Not Found") {
  return res.status(NOT_FOUND_STATUS_CODE).json({
    message,
  });
}

function sendUnauthorized(res, message = "Unauthorized") {
  return res.status(UNAUTHORIZED_STATUS_CODE).json({
    message,
  });
}

function sendAccessDenied(res, message = "Access Denied") {
  return res.status(ACCESS_DENIED_STATUS_CODE).json({
    message,
  });
}

function sendConflict(res, message = "Conflict") {
  return res.status(CONFLICT_STATUS_CODE).json({
    message,
  });
}

function sendInternalError(res, message = "Internal Server Error") {
 return res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).json({
    message,
  });
}

module.exports = {
  sendSuccess,
  sendCreate,
  sendBadRequest,
  sendNotFound,
  sendUnauthorized,
  sendAccessDenied,
  sendConflict,
  sendInternalError,
};
