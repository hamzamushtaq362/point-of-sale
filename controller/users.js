const users = require("../models/users");

exports.findUsers = async function (req, res) {
  let findUser = await users.find({});
};
