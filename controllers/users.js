const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const {
  BAD_REQUEST_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,
  CREATED_STATUS_CODE,
  OK_STATUS_CODE,
  CONFLICT_STATUS_CODE,
  UNAUTHORIZED_STATUS_CODE
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

// Login route to generate a JWT token
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(BAD_REQUEST_STATUS_CODE).send
    ({ message: "Email and password are required"

    });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
       return res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      res.status(UNAUTHORIZED_STATUS_CODE).send({ message: "Invalid email or password" });
    });
};

// update user profile
const updateUser = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.status(OK_STATUS_CODE).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Input validation" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: "User not found" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error has occured on the server" });
    });
};

// GET /users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error has occured on the server" });
    });
};

// POST /users

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

if (!email) {
    return res.status(BAD_REQUEST_STATUS_CODE).send({
      message: "Email is required"
    });
  }

  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
        name,
        avatar,
        email,
        password: hash,
      }))
    .then((user) => User.findById(user._id).select("-password"))
    .then((userWithoutPassword) => {
      res.status(CREATED_STATUS_CODE).send(userWithoutPassword);
    })
    .catch((err) => {
      console.error(err);
      if (err.code === 11000) {
        return res
          .status(CONFLICT_STATUS_CODE)
          .send({ message: "Email already exists" });
      }
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Validation Failed" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

// GET /users/:userId

const getCurrentUser = (req, res) => {
  const userId = req.user._id;
  User.findById(userId)
  .select("-password")
    .orFail()
    .then((user) => res.status(OK_STATUS_CODE).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Invalid user ID format" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error has occured on the server" });
    });
};

module.exports = { getUsers, createUser, getCurrentUser, login, updateUser };
