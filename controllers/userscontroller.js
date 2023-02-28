const User = require("../schema_models/userschema");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports.signUp = (req, res) => {
  console.log(req.body);
  const salt = bcryptjs.genSaltSync(10);
  const hash = bcryptjs.hashSync(req.body.password);
  const userData = new User({ ...req.body, password: hash });

  userData.save((error, doc) => {
    if (error && error.code === 11000) {
      return res.send({
        status: "400",
        message: "Email already exists",
      });
    } else if (error) {
      return res.send({
        status: "400",
        message: error,
      });
    } else {
      return res.send({
        status: "200",
        message: "User Created Successfully",
      });
    }
  });
};

module.exports.login = async (req, res) => {
  console.log(req.body);
  const userData = await User.findOne({ email: req.body.email });
  if (userData) {
    const checkpass = bcryptjs.compareSync(
      req.body.password,
      userData.password
    );
    const token = jwt.sign({ id: userData._id }, process.env.JWT_KEY);
    console.log(token);
    if (checkpass) {
      userData.tokens.push(token);
      User.findByIdAndUpdate(userData._id, userData, (error, doc) => {
        if (!error) {
          return res.send({
            status: "200",
            message: "user login succussfully",
            data: {
              token: userData.tokens[0],
              userName: userData?.userName,
              email: userData?.email,
            },
          });
        } else {
          return res.send({
            status: "500",
            message: "Email or password incorrect",
          });
        }
      });
    } else {
      return res.send({
        status: "500",
        message: "password incorrect",
      });
    }
  } else {
    return res.send({
      status: "500",
      message: "Email not exist",
    });
  }
};

module.exports.logOut = async (req, res) => {
  let token = req.headers.authorization.split(" ")[1];
  console.log(req);
  try {
    const result = await User.updateOne(
      { tokens: [token] },
      { $unset: { tokens: [token] } }
    );
    return res.send({
      status: "200",
      message: "user logout successfully",
      data: result,
    });
  } catch (err) {
    return res.send({
      status: "500",
      message: "user logout error",
    });
  }
};

module.exports.edit = async (req, res) => {
  let token = req.headers.authorization.split(" ")[1];
  const userId = jwt.verify(token, process.env.JWT_KEY).id;
  let updateItem;
  if (req?.body?.userName && req?.body?.email) {
    updateItem = {
      $set: { userName: req?.body?.userName },
      $set: { email: req?.body?.email },
    };
  } else if (req?.body?.userName) {
    updateItem = { $set: { userName: req?.body?.userName } };
  } else if (req?.body?.email) {
    updateItem = { $set: { email: req?.body?.email } };
  } else {
    return res.send({
      status: "200",
      message: "Not received any item for update",
    });
  }
  User.findOneAndUpdate({ _id: userId }, updateItem).exec(function (err, data) {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
};
