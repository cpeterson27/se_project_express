const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const {
  BadRequestError,
  ConflictError,
  InternalServerError,
  NotFoundError,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

// CREATE - POST

const register = async (req, res, next) => {
  try {
    const { name, avatar, email, password } = req.body;

    if (!email) {
      return next(new BadRequestError("Email is required"));
    }

    if (!password) {
      return next(new BadRequestError("Password is required"));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ConflictError("Email already exists"));
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      avatar,
      email,
      password: hash,
    });

    const userWithoutPassword = await User.findById(user._id)
      .select("-password")
      .lean();

    return res.status(201).send(userWithoutPassword);
  } catch (err) {

    if (err.code === 11000) {
      return next (new ConflictError("Email already exists"));
    }
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Validation Failed"));
    }
    return next(new InternalServerError("An error has occurred on the server"));
  }
};

// READ - GET

const getCurrentUser = async (req, res, next) => {
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
      return next(new NotFoundError("User not found"));
    }
    return next(new InternalServerError("An error has occurred on the server"));
  }
};

// UPDATE - PATCH
const updateUserInfo = async (req, res, next) => {
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
      return next(new BadRequestError("Validation Failed"));
    }
    if (err.name === "DocumentNotFoundError") {
      return next(new NotFoundError("User not found"));
    }
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid user ID format"));
    }
    return next(new InternalServerError("An error has occurred on the server"));
  }
};

// LOGIN - POST
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new BadRequestError("Email and password are required"));
    }

    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.send({ token });
  } catch (err) {
    console.error(err);
    return next(new BadRequestError("Invalid email or password"));
  }
};

module.exports = { register, getCurrentUser, login, updateUserInfo };
