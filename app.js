require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors: celebrateErrors, isCelebrateError } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const clothingItemsRouter = require("./routes/clothingItems");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");

const { PORT = 3001, MONGODB_URI } = process.env;
const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_URL
    : "http://localhost:3000",
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// ROUTES FIRST - BEFORE ANY 404 HANDLER
app.use("/", authRouter);           // /signup, /signin
app.use("/users", usersRouter);     // /users/me
app.use("/items", clothingItemsRouter);  // /items/*

// 404 HANDLER - MUST BE AFTER ALL ROUTES
app.use((req, res, next) => {
  const error = new Error("Requested resource not found");
  error.statusCode = 404;
  next(error);
});

// ERROR HANDLERS
app.use((err, req, res, next) => {
  if (isCelebrateError(err)) {
    console.error("Validation error:", err);
  }
  next(err);
});

app.use(celebrateErrors());
app.use(errorLogger);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = statusCode === 500 ? "An internal server error occurred" : err.message;
  res.status(statusCode).send({ message });
});

// MONGODB CONNECTION
mongoose.set("strictQuery", false);
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    console.log("Connected to database:", mongoose.connection.name);
    console.log("Connection host:", mongoose.connection.host);

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

module.exports = app;