const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const likesRouter = require("./routes/likes");
const { createUser } = require("./controllers/users");
const { login } = require("./controllers/users");
const auth = require("./middlewares/auth");
const { getItems } = require("./controllers/clothingItems");
const { createItem } = require("./controllers/clothingItems");
const { deleteItem } = require("./controllers/clothingItems");
const { getCurrentUser } = require("./controllers/users");

const { updateUser } = require("./controllers/users");

const { PORT = 3001 } = process.env;
const app = express();

mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {})
  .catch(console.error);

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
   _id: "5d8b8592978f8bd833ca8133"
  };
  next();
});

app.post("/signin", login);
app.post("/signup", createUser);
app.post("/users", createUser);
app.get("/items", getItems);

app.use(auth);

app.get("/users/me", getCurrentUser);
app.patch("/users/me", updateUser);
app.post("/items", createItem);
app.delete("/items/:itemId", deleteItem);

app.use("/items", likesRouter);

app.listen(PORT, () => {});

module.exports = app;
