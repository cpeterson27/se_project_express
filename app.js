const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const {errors} = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const clothingItemsRouter = require("./routes/clothingItems");
const usersRouter = require("./routes/users");
const { sendNotFound } = require("./utils/errors");

const { PORT = 3001 } = process.env;
const app = express();

mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {})
  .catch(console.error);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message:
      statusCode === 500
        ? "An internal server error occurred"
        : message,
  });
  next();
});

app.use("/items", clothingItemsRouter);
app.use("/users", usersRouter);



app.use((req, res) => {
sendNotFound(res, "Requested resource not found");
});

app.listen(PORT, () => {});

module.exports = app;
