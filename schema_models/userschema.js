const mongoose = require("mongoose");
const schema = mongoose.Schema;
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokens: {
    type: Array,
  },
});

const User = mongoose.model("users", userSchema);

module.exports = User;
