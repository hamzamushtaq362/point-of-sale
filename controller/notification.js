const notification = require("../models/notification");
const users = require("../models/users");

exports.savenotification = async function (req, res) {
  try {
    let notificat = await new notification({
      Title: req.Title,
      Description: req.Description,
      product_id: req.product_id,
      role: req.role,
      seenby: [],
      store_id: req.store,
    });
    notificat.save();
  } catch (err) {
    console.log(err);
  }
};

exports.productnotification = async function (req, res) {
  try {
    const data = await notification
      .find({ store_id: req.store })
      .sort({ $natural: -1 });
    // console.log('notification',data);
    return res.status(200).json({
      data,
    });
  } catch (error) {
    return res.status(401).json({
      message: "not found",
    });
  }
};

exports.checknotification = async function (req, res) {
  let _id = req.params.id;

  try {
    const data = await notification.findByIdAndUpdate(_id, {
      seenby: req.role,
    });
    return res.status(200).json({
      data,
    });
  } catch (error) {
    return res.status(401).json({
      message: "not found this",
    });
  }
};

exports.markallnotification = async function (req, res) {
  try {
    const data = await notification.updateMany(
      { store_id: req.store },
      {
        seenby: req.role,
      }
    );
    return res.status(200).json({
      data,
    });
  } catch (error) {
    return res.status(401).json({
      message: "not found this",
    });
  }
};
