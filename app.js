const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors: celebrateErrors, isCelebrateError } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const clothingItemsRouter = require("./routes/clothingItems");
const usersRouter = require("./routes/users");
const { sendNotFound } = require("./utils/errors");

require("dotenv").config();

const { PORT = 3001, MONGODB_URI } = process.env;
const app = express();

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONEND_URL
        : "http://localhost:3000",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use("/items", clothingItemsRouter);
app.use("/users", usersRouter);

app.use((req, res) => {
  sendNotFound(res, "Requested resource not found");
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
  const message =
    statusCode === 500 ? "An internal server error occurred" : err.message;

  res.status(statusCode).send({ message });

  next();
});

mongoose.set("strictQuery", false);

mongoose
  .connect(MONGODB_URI || "mongodb+srv://cgdesigns93_db_user:Superfam1%21@sparklebows.0ogrl7x.mongodb.net/wtwr?retryWrites=true&w=majority")
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
