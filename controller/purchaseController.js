const addSupplier = require("../models/supplierAdd");
const addPurchase = require("../models/purchaseModel");
const singleProduct = require("../models/addproductmodel");
const products = require("../models/addproductmodel");
const user = require("../models/users");
const roleModel = require("../models/role");
const summaryOfPurchases = require("../models/purchaseSummary");
exports.purchaseAdd = async function (req, res) {
  try {
    if (req.access.purchaseAdd) {
      // for (let i = 0; i < req.body.products.length; i++) {
      //   let searchProduct = await products.findById({
      //     _id: req.body.products[i].productId,
      //   });
      //   let presentQuantity = searchProduct.quantity;
      //   let addProduct =
      //     parseInt(presentQuantity) +
      //     parseInt(req.body.products[i].boughtQuantity);
      //   let updateProduct = await products.findByIdAndUpdate(
      //     searchProduct._id,

      //     {
      //       quantity: addProduct,
      //     }
      //   );
      // }
      console.log("iiioooiioiiooiioio", req.body.supplierId);
      let supplier = await addSupplier.findOne({
        _id: req.body.supplierId,
      });
      // var supplier1 = supplier.supplierName;
      console.log("chuuuuchuuu", supplier);

      let userid = await user.findOne({ email: req.user });
      let createPurchase = await addPurchase
        .create({
          supplierName: supplier.supplierName,
          supplierId: req.body.supplierId,
          billNumber: req.body.billNumber,
          products: req.body.products,
          note: req.body.note,
          netTotal: req.body.netAmount,
          storeId: req.store,
          userId: userid._id,
        })
        .then((d3) => {
          summaryOfPurchases
            .find({
              // cities: req.body.city,
              storeId: req.store,
              supplierName: supplier.supplierName,
            })
            .then((responce) => {
              console.log("====2===", responce);
              if (responce.length) {
                let count = responce[0].count + 1;
                let net = responce[0].netTotal + req.body.netAmount;
                console.log("reponse 0", responce[0]);
                console.log("reponse 0 netTotal", responce[0].netTotal);
                console.log("net ", net);
                console.log("new count", count, responce[0].count);
                summaryOfPurchases
                  .updateOne(
                    { _id: responce[0]._id },
                    { $set: { count: count, netTotal: net } }
                  )
                  .then((d) => {
                    console.log("====3===", d);
                    return res.status(200).json({
                      createPurchase,
                      d,
                    });
                  });
              } else {
                summaryOfPurchases
                  .create({
                    supplierName: supplier.supplierName,
                    storeId: req.store,
                    count: 1,
                    netTotal: req.body.netAmount,
                  })
                  .then((d2) => {
                    console.log("====4===");
                    return res.status(200).json({
                      message: "Purchase has been added",
                      createPurchase,
                    });
                  });
              }
            });
          // });
        });
    } else {
      return res.status(401).json("you have no access for this route");
    }
  } catch (error) {
    console.log("Error: Error: Purchase not added");
    return res.status(401).send("Error: Error: Purchase not added");
  }
};

exports.deletePurchase = async function (req, res) {
  try {
    if (req.access.purchaseDelete) {
      let _id = req.params.id;
      let deletePurchaseData = await addPurchase.findById(_id);
      if (!deletePurchaseData) {
        return res.status(404).json({
          message: "This Id does not exist",
        });
      }
      deletePurchaseData = await addPurchase.findByIdAndDelete(_id);
      // // console.log("Deleted Purchase: ", deletePurchaseData);
      return res.json({
        message: "The purchase has been deleted",
        deletePurchaseData,
      });
    } else {
      return res.status(401).json("you have no access for this route");
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      error: "The purchase could not be deleted",
    });
  }
};

exports.updatePurchase = async function (req, res) {
  try {
    console.log(req.access.purchaseUpdate);
    if (req.access.purchaseUpdate) {
      let _id = req.query.id;
      // console.log(req.query.id);
      // console.log(req.query.name);

      const purchaseUpdate = await addSupplier.findByIdAndUpdate(
        _id,
        {
          contact: req.body.contact,
          country: req.body.country,
          city: req.body.city,
          purchasePrice: req.body.purchasePrice,
          notes: req.body.notes,
          quantity: req.body.quantity,
        },
        {
          new: true,
        }
      );
      // // console.log("Updated purchase: ", purchaseUpdate);
      return res.status(200).json({
        message: "The purchase has been updated",
        purchaseUpdate,
      });
    } else {
      return res.status(401).json("you have no access for this route");
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      error: "The purchase could not be updated",
    });
  }
};

exports.showPurchase = async function (req, res) {
  try {
    let id = req.user;
    let storeId = req.store;
    // console.log(req.user);

    let purchaseInformation = await addPurchase
      .find({ storeId: storeId })
      .sort({ date: -1 });
    console.log(purchaseInformation);
    return res.status(200).json({
      purchaseInformation,
    });
  } catch (error) {
    return res.status(500).send("Some error occurred");
  }
};

exports.getSingleProduct = async function (req, res) {
  let barcode = req.params.id;
  // console.log(barcode);
  let product = await singleProduct.findOne({ barcode_id: barcode });
  // console.log(product);
  return res.json({
    product,
  });
};

exports.searchPurchaseDetails = async function (req, res) {
  try {
    console.log("SAUUUUUUUUUUUUUUUUUUUD");

    if (req.role == "admin" || req.role == "manager") {
      let key = req.query.find;
      console.log("========> ", key);

      let searchPurchase = await addPurchase
        .find({
          $or: [
            // { date : { $regex: key, $options: "i" } },
            { supplierName: { $regex: key, $options: "i" } },
            { billNumber: { $regex: key } },
          ],
        })

        .sort({ date: -1 });

      console.log(searchPurchase);
      return res.status(200).json({
        message: "Details found ",
        searchPurchase,
      });
    } else {
      return res.status(404).json({
        error: "Purchase not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: "There is an error",
    });
  }
};
