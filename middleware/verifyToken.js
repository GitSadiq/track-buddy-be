const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  let token = req.headers.authorization.split(" ")[1];
  const isExist = jwt.verify(token, process.env.JWT_KEY);
  if (isExist.id) {
    next();
  }
};

module.exports = verifyToken;
