const users = require("../models/users");
const roleModel = require("../models/role");
const permissionModels = require("../models/permissions");

const Email = require("../controller/email");

exports.getData = async function (req, res) {
  try {
    let { page, size } = req.query;
    if (!page) {
      page = 1;
    }
    if (!size) {
      size = 10;
    }

    const limit = parseInt(size);
    const skip = (page - 1) * size;
    let x = null;
    const userdata = await roleModel.findOne(req.params.id, { role: "admin" });
    console.log(userdata._id);
    const Data = await users.find({ role_id: userdata._id });
    const count = await users.count();
    res.status(200).json({
      message: "List shown",
      Data,
      count,
    });
  } catch (error) {
    res.status(401).json({
      error: "error appeared",
    });
  }
};

// Update User Status from Pending to Active
exports.update = async function (req, res) {
  try {
    let user = await users.findById(req.params.id);
    if (!user) {
      return res.status(404).send("Not Found ");
    }
    // console.log(user);
    Email.onAccept(user, (info) => {
      console.log(`the mail has been sent and id is: ${info.messageId}`);
    });

    // update admin status to active from pending
    user = await users.findByIdAndUpdate(user, {
      status: "active",
    });

    // update permissions to true for admin role
    permiss= await permissionModels.updateMany(
      { _id: req.body.id },  
        { 
          employeeAdd: true,
        employeeView: true,
        employeeUpdate: true,
        employeeDelete: true,
        purchaseAdd: true,
        purchaseView: true,
        purchaseUpdate: true,
        purchaseDelete: true,
        productAdd: true,
        productView: true,
        productUpdate: true,
        productDelete: true,
        supplierAdd: true,
        supplierView: true,
        supplierUpdate: true,
        supplierDelete: true,
        expenseAdd: true,
        expenseView: true,
        expenseUpdate: true,
        expenseDelete: true,
        storeAdd: true,
        storeView: true,
        storeCreate: true,
        storeUpdate: true,
        storeDelete: true,
        sellProduct: true,
        sellView: true,
        sellUpdate: true,
        sellDelete: true, 
      });

    return res.json({ user, permiss });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal Server Error in update in data.js");
  }
};

// Update User Status from Active/Pending to Decline
exports.decline = async function (req, res) {
  try {
    let user = await users.findById(req.params.id);
    if (!user) {
      return res.status(404).send("Not Found ");
    }

    console.log(user);

    Email.onReject(user, (info) => {
      console.log(`the mail has been sent and id is: ${info.messageId}`);

      //  return res.send(info);
    });

    user = await users.findByIdAndUpdate(user, {
      status: "decline",
    });
    Email.onReject(user, (info) => {
      console.log(`the mail has been sent and id is: ${info.messageId}`);
    });
    res.json({ user });
  } catch (error) {
    console.error(error.message);
    res.status(401).send("Internal Server Error");
  }
};

exports.sorting = async function (req, res) {
  let user = await users.find({ role: "admin" });
  console.log(user);
  if (user) {
    var status = req.body.status;
    console.log("Status ", status);
    try {
      const userdata = await roleModel.findOne(req.params.id, {
        role: "admin",
      });
      console.log(userdata._id);
      users.find({ role_id: userdata._id, status }).exec((err, docs) => {
        if (err) {
          responseObj = {
            status: "error",
            msg: "Error occured.",
            body: err,
          };
          res.status(401).send(responseObj);
        } else {
          responseObj = {
            status: "success",
            msg: "Fetch record",
            body: docs,
          };
          res.status(200).send(responseObj);
          console.log(responseObj);
        }
      });
    } catch (error) {
      console.log("Error", error);
    }
  } else {
    console.log("admin users not found");
  }
};

exports.search = async (req, res) => {
  try {
    const query = req.query.search;
    const objs = await users.find({
      role: 'admin',
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { company: { $regex: query, $options: 'i' } },
        // searchCountry: {
        //   countryName: { $regex: key, $options: 'i' },
        // },
        // { firstName: query }, { lastName: query }, { company: query }
      ],
    }).populate("role_id", 'role')
    return res.status(200).json({ objs });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
