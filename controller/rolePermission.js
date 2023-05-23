const roleModel = require("../models/role");
const permissionModels = require("../models/permissions");

exports.getRoles = async function (req, res) {
  try {
    let roles = await roleModel.find({}, "role");
    // console.log("dnkjvvvvvvvvvvvvvvvvvsn", roles);
    if (!roles) {
      return res.status(404).json({
        error: "roles not found",
      });
    }

    return res.status(200).json({
      message: "Roles FOund",
      roles,
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      error: "something went wrong",
    });
  }
};

exports.addRolePermission = async function (req, res) {
  try {
    let role = await roleModel.findOne({ role: req.body.Rolename });
    if (role) {
      await permissionModels.updateMany(
        { _id: req.body.id },  
          { 
            employeeAdd: req.body.ecreate,
          employeeView: req.body.eread,
          employeeUpdate: req.body.eupdate,
          employeeDelete: req.body.edelete,
          purchaseAdd: req.body.purcreate,
          purchaseView: req.body.purread,
          purchaseUpdate: req.body.purupdate,
          purchaseDelete: req.body.purdelete,
          productAdd: req.body.pcreate,
          productView: req.body.pread,
          productUpdate: req.body.pupdate,
          productDelete: req.body.pdelete,
          supplierAdd: req.body.screate,
          supplierView: req.body.sread,
          supplierUpdate: req.body.supdate,
          supplierDelete: req.body.sdelete,
          expenseAdd: req.body.expcreate,
          expenseView: req.body.expread,
          expenseUpdate: req.body.expupdate,
          expenseDelete: req.body.expdelete,
          storeAdd: req.body.storecreate,
          storeView: req.body.storeview,
          storeCreate: req.body.storeread,
          storeUpdate: req.body.storeupdate,
          storeDelete: req.body.storedelete,
          sellProduct: req.body.sellproduct,
          sellView: req.body.sellview,
          sellUpdate: req.body.sellupdate,
          sellDelete: req.body.selldelete, 
        } 
        );
      return res.status(409).json({
        message: "Designation already exist. Permissions are updated",
      });
    } else {
      let permissions = await permissionModels.create({
        employeeAdd: req.body.ecreate,
        employeeView: req.body.eread,
        employeeUpdate: req.body.eupdate,
        employeeDelete: req.body.edelete,
        purchaseAdd: req.body.purcreate,
        purchaseView: req.body.purread,
        purchaseUpdate: req.body.purupdate,
        purchaseDelete: req.body.purdelete,
        productAdd: req.body.pcreate,
        productView: req.body.pread,
        productUpdate: req.body.pupdate,
        productDelete: req.body.pdelete,
        supplierAdd: req.body.screate,
        supplierView: req.body.sread,
        supplierUpdate: req.body.supdate,
        supplierDelete: req.body.sdelete,
        expenseAdd: req.body.expcreate,
        expenseView: req.body.expread,
        expenseUpdate: req.body.expupdate,
        expenseDelete: req.body.expdelete,
        storeAdd: req.body.storecreate,
        storeCreate: req.body.storeread,
        storeUpdate: req.body.storeupdate,
        storeDelete: req.body.storedelete,
        sellProduct: req.body.sellproduct,
        sellView: req.body.sellview,
        sellUpdate: req.body.sellupdate,
        sellDelete: req.body.selldelete,
      });
      console.log(permissions._id);

      role = await roleModel.create({
        role: req.body.Rolename,
        permission_id: permissions._id,
      });
      return res.status(200).json({
        message: "successfully added role",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      error: "something went wrong",
    });
  }
};
