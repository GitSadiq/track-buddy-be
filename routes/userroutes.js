const express = require("express");
const routes = express.Router();

const {
  signUp,
  login,
  logOut,
  edit,
} = require("../controllers/userscontroller");
const verifyToken = require("../middleware/verifyToken");

routes.post("/signup", signUp);
routes.post("/login", login);
routes.post("/logout", verifyToken, logOut);
routes.put("/edit", verifyToken, edit);

module.exports = routes;
