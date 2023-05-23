const User = require("../models/users");
const roles = require("../models/role");

exports.viewemployee = async function (req, res) {
  try {
    if (req.access.employeeView) {
      const data = await User.find({ storeId: req.store, isDeleted: false })
      .populate({path: "role_id", populate: "permission_id"});
      // console.log(data);
      if (!data) {
        return res.status(404).json({
          message: "Users not found from admin",
        });
      }
      return res.status(200).json({
        message: "data found",
        data,
      });
    } else {
      return res.status(401).json("you have no access for this route");
    }
  } catch (error) {
    return res.status(401).json({
      message: "not found from employee controller",
    });
  }
};

exports.deleteEmployee = async function (req, res) {
  try {
    if (req.access.employeeDelete) {
      let _id = req.params.id;

      let deleteEmployeeData = await User.findById(_id, {
        deleted: false,
      });
      if (!deleteEmployeeData) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      let deleteEmployee = await User.findByIdAndUpdate(_id, {
        isDeleted: true,
      });

      return res.json({
        message: "The Employee has been deleted",
        deleteEmployee,
      });
    } else {
      return res.status(401).json("you have no access for this route");
    }
  } catch (error) {
    console.log(error);
  }
};

exports.updateEmployee = async function (req, res) {
  try {
    if (req.access.employeeUpdate) {
      let _id = req.params.id;
      const employeeUpdate = await User.findByIdAndUpdate(
        _id,
        {
          name: req.body.name,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: secPass,
          phoneNumber: req.body.phoneNumber,
          company: req.body.company,
          Address: req.body.address,
        },
        {
          new: true,
        }
      );
      return res.status(200).json({
        message: "The Employee has been updated",
        employeeUpdate,
      });
    } else {
      return res.status(401).json("you have no access for this route");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Some error occurred");
  }
};

exports.employeePagination = async function (req, res) {
  try {
    if (req.access.employeeView) {
      let { page = 1, size = 10 } = req.query;

      const limit = parseInt(size);
      const skip = (page - 1) * size;

      const employeeDatabyPage = await User.find()
        .skip(skip)
        .limit(limit * 1);

      console.log("==============>>>>", employeeDatabyPage);

      res.status(200).json({
        message: "List shown",
        employeeDatabyPage,
      });
    } else {
      return res.status(401).json("you have no access for this route");
    }
  } catch (error) {
    res.status(401).json({
      error: "error appeared",
    });
  }
};
