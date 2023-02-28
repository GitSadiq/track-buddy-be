const mongoose = require("mongoose");
const schema = mongoose.Schema;
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const groupSchema = new schema({
  name: {
    type: String,
    required: true,
  },
  creatorId: {
    type: String,
    required: true,
  },
  members: {
    type: Array,
  },
});

const Groups = mongoose.model("groups", groupSchema);

module.exports = Groups;
