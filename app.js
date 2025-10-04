const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const mainRouter = require("./routes/index");
const likesRouter = require("./routes/likes")

const { PORT = 3001 } = process.env;
const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(console.error);

app.use(cors())
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '68dae1c8e065fd2f94044648'
  };
  next();
})

app.use(likesRouter);

app.use("/", mainRouter); // GET POST DELETE PATCH etc....

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
