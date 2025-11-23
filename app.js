require("dotenv").config({ path: "./.env" });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const helmet = require('helmet');

const { errors: celebrateErrors, isCelebrateError } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const clothingItemsRouter = require("./routes/clothingItems");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const limiter = require('./utils/rateLimiter');


const { PORT = 3001, MONGODB_URI } = process.env;

const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_URL
    : "http://localhost:3000",
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(limiter);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.use("/", authRouter);
app.use("/users", usersRouter);
app.use("/items", clothingItemsRouter);

app.use((req, res, next) => {
  const error = new Error("Requested resource not found");
  error.statusCode = 404;
  next(error);
});

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

mongoose.set("strictQuery", false);

const connectWithRetry = () => {
  mongoose
    .connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
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
      console.log("Retrying connection in 5 seconds...");
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

module.exports = app;