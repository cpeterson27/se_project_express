const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const {
  sendCreateResponse,
  BadRequestError,
  ConflictError,
  InternalServerError,
  NotFoundError,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

// CREATE - POST

const register = async (req, res) => {
  try {
    const { name, avatar, email, password } = req.body;

    console.log('=== REGISTRATION START ===');
    console.log('Registration attempt:', { name, email, avatar });

    if (!email) {
      throw new BadRequestError("Email is required");
    }

    if (!password) {
      throw new BadRequestError("Password is required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      throw new ConflictError("Email already exists");
    }

    const hash = await bcrypt.hash(password, 10);

    console.log('Creating user in database...');
    const user = await User.create({
      name,
      avatar,
      email,
      password: hash,
    });

    console.log('✅ User created successfully:', user._id);
    console.log('User object:', JSON.stringify(user.toObject(), null, 2));

    const userWithoutPassword = await User.findById(user._id)
      .select("-password")
      .lean();

    console.log('=== REGISTRATION COMPLETE ===');
    return res.status(201).send(userWithoutPassword);
  } catch (err) {
    console.error('❌ Registration error:', err);
    console.error('Error stack:', err.stack);
    if (err.code === 11000) {
      throw new ConflictError("Email already exists");
    }
    if (err.name === "ValidationError") {
      throw new BadRequestError("Validation Failed");
    }
    throw new InternalServerError("An error has occurred on the server");
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
      throw new NotFoundError("User not found");
    }
    throw new InternalServerError("An error has occurred on the server");
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
      throw new BadRequestError("Validation Failed");
    }
    if (err.name === "DocumentNotFoundError") {
      throw new NotFoundError("User not found");
    }
    if (err.name === "CastError") {
      throw new BadRequestError("Invalid user ID format");
    }
    throw new InternalServerError("An error has occurred on the server");
  }
};

// LOGIN - POST
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError("Email and password are required");
    }

    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.send({ token });
  } catch (err) {
    console.error(err);
    throw new BadRequestError("Invalid email or password");
  }
};

module.exports = { register, getCurrentUser, login, updateUserInfo };
