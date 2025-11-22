const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const {
  sendBadRequest,
  sendNotFound,
  sendInternalError,
  sendCreate,
  sendConflict,
  sendUnauthorized,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

// CREATE - POST

const register = async (req, res) => {
  try {
    const { name, avatar, email, password } = req.body;

    console.log("Registration attempt:", { name, email, avatar }); // Debug log

    if (!email) {
      return sendBadRequest(res, "Email is required");
    }

    if (!password) {
      return sendBadRequest(res, "Password is required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists:", email); // Debug log
      return sendConflict(res, "Email already exists");
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      avatar,
      email,
      password: hash,
    });

    console.log("User created successfully:", user._id);

    const userWithoutPassword = await User.findById(user._id)
      .select("-password")
      .lean();

    return sendCreate(res, userWithoutPassword);
  } catch (err) {
    console.error("Registration error:", err);
    if (err.code === 11000) {
      return sendConflict(res, "Email already exists");
    }
    if (err.name === "ValidationError") {
      return sendBadRequest(res, "Validation Failed");
    }
    return sendInternalError(res, "An error has occurred on the server");
  }
};

// READ - GET

const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
      .select("-password")
      .orFail()
      .lean();

    return res.json(user);
  } catch (err) {
    console.error(err);
    if (err.name === "DocumentNotFoundError") {
      return sendNotFound(res, "User not found");
    }
    return sendInternalError(res, "An error has occurred on the server");
  }
};

// UPDATE - PATCH
const updateUserInfo = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, avatar },
      { new: true, runValidators: true }
    )
      .select("-password")
      .orFail()
      .lean();

    return res.json(user);
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return sendBadRequest(res, "Validation Failed");
    }
    if (err.name === "DocumentNotFoundError") {
      return sendNotFound(res, "User not found");
    }
    if (err.name === "CastError") {
      return sendBadRequest(res, "Invalid user ID format");
    }
    return sendInternalError(res, "An error has occurred on the server");
  }
};

// LOGIN - POST
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendBadRequest(res, "Email and password are required");
    }

    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.send({ token });
  } catch (err) {
    console.error(err);
    return sendUnauthorized(res, "Invalid email or password");
  }
};

module.exports = { register, getCurrentUser, login, updateUserInfo };
