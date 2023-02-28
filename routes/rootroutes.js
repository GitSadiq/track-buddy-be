const express = require("express");
const routes = express.Router();

routes.use("/user", require("./userroutes"));
routes.use("/groups", require("./groupsroutes"));

module.exports = routes;
