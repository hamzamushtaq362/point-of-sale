const { query } = require("express");
const expense = require("../models/expense");
const store = require("../models/storeModel");
const category1 = require("../models/category_expense");
const users = require("../models/users");
const csvtojson = require("csvtojson");

exports.expCategories = async function (req, res) {
  try {
    if (req.access.expenseAdd) {
      const Data = await category1.find({});
      const count = await category1.count();
      if (Data) {
        return res.status(200).json({
          message: "category list Data",
          Data,
        });
      }
      if (Data == "") {
        csvtojson()
          .fromFile("public/expense.csv")
          .then(async (csvData) => {
            const csvdata = await category1.insertMany(csvData).then((res1) => {
              return res.status(200).json({
                message: "category added successfuly!",
                csvdata,
              });
            });
          });
      }
    } else {
      return res.status(401).json("you have no access for this route");
    }
  } catch (error) {
    console.log("---------", error);
    return res.status(500).send("Some error occurred");
  }
};

exports.createExp = async (req, res) => {
  let success = false;
  try {
    if (req.access.expenseAdd) {
      const { category, amount, date, billStatus, description, storeId } =
        req.body;
      let user = await users.findOne({ email: req.body.user });
      let categoryId = await category1.findOne({ category: category });
      if (!user) {
        return res
          .status(400)
          .json({ success, error: "Sorry user not found!" });
      }
      // let name = await store.findOne({ _id: req.store });
      // console.log(roleId);
      const exp = await expense.create({
        category: categoryId._id,
        amount: amount,
        date: date,
        store_Id: req.store,
        billStatus: billStatus,
        description: description,
        userId: req.id,
      });

      res.status(200).json({
        message: "expense added successfull",
        exp,
      });
    } else {
      return res.status(401).json("you have no access for this route");
    }
  } catch (error) {
    console.error(error.message);
    return res.status(401).json("Some error occured");
  }
};

exports.getExp = async (req, res) => {
  try {
    if (req.access.expenseView) {
      let catdata = await expense.find({});
      // console.log(catdata);

      let data = await expense
        .find({ store_Id: req.store })
        .lean()
        .populate("category", "category ");
      return res.status(200).json({
        message: "expenses data",
        data,
      });
    } else {
      return res.status(401).json("you have no access for this route");
    }
  } catch (error) {
    console.error(error.message);
    return res.status(401).json("Some error occured");
  }
};

exports.viewExp = async (req, res) => {
  let user = await store.find({});
  // console.log(user);
  try {
    if (req.access.expenseView) {
      const user = await expense.find({ storeId: req.store }).exec((err) => {
        if (err) {
          responseObj = {
            status: "error",
            msg: "Error occured.",
            err,
          };
          res.status(401).json(responseObj);
        } else {
          responseObj = {
            status: "success",
            msg: "Fetch record",
            user,
          };
          res.status(200).send(responseObj);
          // console.log(responseObj);
        }
      });
    } else {
      return res.status(401).json("you have no access for this route");
    }
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json("Some error occured");
  }
};

exports.deleteExp = async (req, res) => {
  try {
    if (req.access.expenseDelete) {
      let _id = req.params.id;
      console.log("id is : ", _id);

      let data = await expense.findById(_id);
      if (!data) {
        return res.status(404).json({
          message: "This expense id does not exist",
        });
      }
      let dltExp = await expense.findByIdAndDelete(_id);
      console.log(dltExp);
      return res.json({
        message: "The expense has been deleted",
        dltExp,
      });
    } else {
      return res.status(401).json("you have no access for this route");
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json("Some error occured");
  }
};

exports.updateExp = async (req, res) => {
  console.log("updaaat");
  try {
    if (req.access.expenseUpdate) {
      console.log("HELLLLOOOOOOOOOOOOO", req.params);
      let _id = req.params.id;
      const { category, amount, date, billStatus, description } = req.body;
      console.log("id is : ", _id);

      let user = await expense.findById(_id);
      if (!user) {
        return res.status(404).json({
          message: "This expense id does not exist",
        });
      }
      let updatedExp = await expense.findByIdAndUpdate(_id, {
        category: category,
        amount: amount,
        date: date,
        billStatus: billStatus,
        description: description,
      });
      return res.json({
        message: "The expense has been updated",
        updatedExp,
      });
    } else {
      return res.status(401).json("you have no access for this route");
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json("Some error occured");
  }
};

exports.search = async function (req, res) {
  console.log("helllllllooooo  ");
  try {
    if (req.access.expenseView) {
      const key = req.query.find;
      console.log(key);
      const objs = await expense
        .find({
          $or: [
            // { category: { $regex: key, $options: "i" }},
            { billStatus: { $regex: key, $options: "i" } },
          ],
        })
        .lean()
        .populate("category", "category");
      return res.status(200).json({ objs });
    } else {
      return res.status(401).json("you have no access for this route");
    }
    // console.log(objs);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

exports.getSingleStoreExp = async (req, res) => {
  try {
    if (req.access.expenseView) {
      const branchName = req.body.branchName;
      let user = await users.findOne({ email: req.user });
      if (!user) {
        return res.status(400).json("Sorry user not found!");
      }
      const name = await store.findOne({ branchName: branchName });
      if (!name) {
        res.json("branch name does not exxist");
      } else {
        const data = await expense.find({ branchName }).exec((err, data) => {
          if (data) {
            return res.status(200).json({
              message: "single branch expense",
              data: data,
            });
          } else {
            res.status(400).json("some err occur", err);
          }
        });
      }
    } else {
      return res.status(401).json("you have no access for this route");
    }
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json("Some error occured");
  }
};
