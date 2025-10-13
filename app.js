const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const mainRouter = require("./routes/index");
const likesRouter = require("./routes/likes")
const { createUser } = require("./controllers/users");
const { login } = require("./controllers/users");
const auth = require("./middlewares/auth");

const { getItems } = require("./controllers/clothingItems");

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

app.post('/signin', login);
app.post('/signup', createUser);

app.get('items', getItems)

app.use(auth);

app.use(likesRouter);

app.use("/", mainRouter); // GET POST DELETE PATCH etc....

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
