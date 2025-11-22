const { OK_STATUS_CODE, CREATED_STATUS_CODE } = require('./constants');

function sendSuccessResponse(res, data = null, message = "Success") {
  return res.status(OK_STATUS_CODE).json({
    message,
    data,
  });
}

function sendCreateResponse(res, data = null, message = "Created") {
  return res.status(CREATED_STATUS_CODE).json({
    message,
    ...data,
  });
}

module.exports = {
  sendSuccessResponse,
  sendCreateResponse
}