const express = require("express");
const routes = express.Router();

const {
  AddGroups,
  Allgroups,
  JoinGroup,
} = require("../controllers/groupscontroller");
// const verifyToken = require("../middleware/verifyToken");

routes.post("/add", AddGroups);
routes.get("/allgroups", Allgroups);
routes.put("/join", JoinGroup);

module.exports = routes;
