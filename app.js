const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
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

app.use("/items", clothingItemsRouter);
app.use("/", usersRouter);

app.use((req, res) => {
res.status(sendNotFound).json({message: "Requested resource not found"});
});

app.listen(PORT, () => {});

module.exports = app;
