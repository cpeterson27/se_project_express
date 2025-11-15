const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { sendUnauthorized } = require("../utils/errors");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return sendUnauthorized(res, "Authorization required"); // Remove .catch()
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error("JWT verification failed:", err);
    return sendUnauthorized(res, "Authorization required");
  }

  req.user = payload;

  return next();
};