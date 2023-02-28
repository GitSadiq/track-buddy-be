const Groups = require("../schema_models/groupsschema");
const User = require("../schema_models/userschema");
const jwt = require("jsonwebtoken");

module.exports.AddGroups = async (req, res) => {
  const creatorId = jwt.verify(req.body.token, process.env.JWT_KEY).id;
  const currentUser = await User.findById(creatorId).exec();
  console.log(currentUser);
  const groupsData = new Groups({
    name: req.body.name,
    creatorId,
    members: {
      userId: currentUser._id,
      userName: currentUser.userName,
      email: currentUser.email,
      lng: req.body.lng,
      lat: req.body.lat,
    },
  });
  groupsData.save((error, doc) => {
    if (error) {
      return res.send({
        status: "400",
        message: "groups created error",
      });
    } else {
      return res.send({
        status: "200",
        message: "Groups Created Successfully",
        doc,
      });
    }
  });
};

module.exports.Allgroups = async (req, res) => {
  const userId = jwt.verify(req.query.id, process.env.JWT_KEY).id;

  try {
    const doc = await Groups.find({
      $or: [{ "members.userId": userId }, { creatorId: userId }],
    }).exec();
    if (doc) {
      return res.send({
        status: "200",
        message: "user available in this group",
        data: doc,
      });
    } else {
      return res.send({
        status: "400",
        message: "user not available in this group",
      });
    }
  } catch (error) {
    return res.send({
      status: "500",
      message: "error occurred",
    });
  }
};

module.exports.JoinGroup = async (req, res) => {
  let { lng, lat } = req.body;
  console.log(req.body.token, req.query.id);
  // this code to find user
  const userId = jwt.verify(req.body.token, process.env.JWT_KEY).id;
  const userData = await User.findById(userId).exec();
  console.log(userData, userId);
  const updateMembers = {
    $push: {
      members: {
        userId: userData?._id.toString(),
        userName: userData?.userName,
        email: userData?.email,
        lng,
        lat,
      },
    },
  };

  Groups.findByIdAndUpdate(
    req.query.id,
    updateMembers,
    { new: true },
    (error, doc) => {
      console.log(doc);
      if (!error) {
        return res.send({
          status: "200",
          message: "Join group successfully",
          doc,
        });
      } else {
        return res.send({
          status: "500",
          message: "Join group Erro",
        });
      }
    }
  );
};
