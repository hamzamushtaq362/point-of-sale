const Product = require("../models/addproductmodel");
const users = require("../models/users");
const sales = require("../models/saleModel");
const notificat = require("../sockets");
const receiptline = require("receiptline");
const summaryOfSales = require("../models/salesSummary");

exports.searchProductDetails = async function (req, res) {
  try {
    let key = req.query.search;
    console.log("key is=", key);
    console.log(req.store);
    let storeId = req.store;
    // let searchByStore = await users.findById(req.id);
    // if (!searchByStore) {
    //   return res.status(404).json({
    //     message: "User not found",
    //   });
    // }
    // console.log("User in cashier", searchByStore);

    let searchProduct = await Product.findOne({
      store_id: storeId,
      //   $and: [{
      //     store_id: storeId
      // }],
      // $or: [
      //   { product_name: key.toLowerCase() },
      //   { barcode_id: key.toLowerCase() },
      // ],
    });
    console.log(searchProduct);

    if (!searchProduct) {
      return res.status(404).json({
        message: "Products is not found",
      });
    }
    if (searchProduct.quantity <= 0) {
      return res.status(409).json({
        message: "product not in stock",
      });
    }
    console.log("products in store", searchProduct);
    return res.status(200).json({
      message: "Details found ",
      searchProduct,
    });
  } catch (error) {
    return res.status(404).json({
      message: "product not found",
    });
  }
};

exports.updateQTY = async function (req, res) {
  try {
    let troducts = req.body.soldProducts;
    console.log(troducts)
    let new_quantity;

    for (let i = 0; i < troducts.length; i++) {
      let qProducts = await Product.findById(troducts[i]._id);
      if (parseInt(qProducts.quantity) < parseInt(troducts[i].newQuantity)) {
        return res.status(400).json({
             err: `${qProducts.product_name} available quantity is ${qProducts.quantity}, can't sell this product`
    })
      }
    }

    for (let i = 0; i < troducts.length; i++) {
      let qProducts = await Product.findById(troducts[i]._id);

      
      if (parseInt(qProducts.quantity) >= parseInt(troducts[i].newQuantity)) {
        new_quantity =
          parseInt(qProducts.quantity) - parseInt(troducts[i].newQuantity);
        // console.log("subtracts quantity", new_quantity);
        if (qProducts.quantity > 0 && qProducts.quantity < 10) {
          let notification = {
            Title: "products",
            Description: `${qProducts.product_name} product is out of stock`,
            product_id: qProducts._id,
            role: [],
            store_id: qProducts.store_id,
          };
          notificat.noti(notification);
        }
      }

      const Pro = await Product.findByIdAndUpdate(qProducts, {
        quantity: new_quantity,
      });

      // console.log(Pro);
    }

    console.log(troducts.length);
    return res.status(200).json({
      message: "The products has been updated",
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      message: "The products not updated",
      err,
    });
  }
};

exports.checkQTYOnChange = async function (req, res){
  try {

    
      let troducts = req.body.soldProducts;
      console.log(troducts);

      for (let i = 0; i < troducts.length; i++) {
        let qProducts = await Product.findById(troducts[i]._id);
        console.log(qProducts.quantity);
        console.log(troducts[i].newQuantity);
        if (parseInt(qProducts.quantity) < parseInt(troducts[i].newQuantity)) {
           res.status(400).json({
            err: `${qProducts.product_name} available quantity is ${qProducts.quantity}`
          })
        }
      }
    
  } catch (error) {
    console.log(error);
  }
}

exports.addSales = async function (req, res) {
  try {
    console.log(req.access.sellProduct);

    if (true) {
      console.log("invoice is", req.body.InvoiceNo);

      let troducts = req.body.soldProducts;
      console.log(troducts);

      for (let i = 0; i < troducts.length; i++) {
        // console.log(_id[i]);
        let qProducts = await Product.findById(troducts[i]._id);
        console.log(qProducts);
        if (parseInt(qProducts.quantity) < parseInt(troducts[i].newQuantity)) {
          return res.status(400).json({
            err: `${qProducts.product_name} available quantity is ${qProducts.quantity}`
          })
        }
      }

      let sale = await sales
        .create({
          invoiceNo: req.body.InvoiceNo,
          soldProducts: req.body.soldProducts,
          subTotal: req.body.subTotal,
          discount: req.body.discount,
          netAmount: req.body.netAmount,
          storeId: req.store,
        })
        .then((d3) => {
          console.log("====1===");
          summaryOfSales
            .find({ invoiceNo: req.body.invoiceNo })
            .then((responce) => {
              console.log("====2===", responce);
              if (responce.length && responce.storeId == req.store) {
                let count = responce[0].count + 1;
                console.log("new count", count);
                summaryOfSuppliers
                  .updateOne(
                    { _id: responce[0]._id },
                    { $set: { count: count } }
                  )
                  .then((d) => {
                    console.log("====3===", d);
                    return res.status(200).json({
                      sale,
                      data,
                    });
                  });
              } else {
                summaryOfSales
                  .create({
                    invoiceNo: req.body.InvoiceNo,
                    storeId: req.store,
                    count: 1,
                  })
                  .then((d2) => {
                    console.log("====4===", d2);
                    return res.status(200).json({
                      message: "Invoice Added",
                      d2,
                      date: Date.now,
                    });
                  });
              }
            });
        });
    } else {
      return res.status(401).json("you have no access for this route");
    }
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      message: "Invoice Not Added",
      err,
    });
  }
};

exports.showSellData = async function (req, res) {
  try {
    if (req.access.sellView) {
      // let fetchCountry = await countryModels.find();
      // console.log("Countries have been found for Admin : ", fetchCountry);

      let supplierInformation = await sales
        .find({ storeId: req.store, deleted: false })
        .lean();

      // .sort({ date: -1 });

      console.log("The Supplier Info is : ", supplierInformation);
      return res.status(200).json({
        message: "Sale info found",
        supplierInformation,
      });
    } else {
      return res.status(401).json("you have no access for this route");
    }
  } catch (error) {
    return res.status(404).json({
      error:
        "There is an error which is stopping this controller from functioning",
    });
  }
};

exports.searchSalesDetails = async function (req, res) {
  try {
    // if (req.access.supplierView) {
    let key = req.query.find;
    console.log("========> ", key);

    let searchSupplier = await sales
      .find({
        $or: [{ invoiceNo: { $regex: key } }],
      })
      .sort({ date: -1 });
    console.log(searchSupplier);
    return res.status(200).json({
      message: "Details found ",
      searchSupplier,
    });
    // } else {
    //   return res.status(401).json("you have no access for this route");
    // }
  } catch (error) {
    return res.status(404).json({
      error: "Sale not found",
    });
  }
};

exports.updateSaleQTY = async function (req, res) {
  try {
    if (req.access.sellUpdate) {
      let troducts = req.body.soldProducts;
      let _id = req.body._id;
      let invoiceNo = req.body.InvoiceNo;
      console.log("qtyupdate=", req.body);
      // console.log("bodyyyy",req.body)
      // let qProducts = await sales.findOne({invoiceNo:req.body.InvoiceNo});
      //   console.log("products is finddddd",qProducts);
      //   if(!qProducts){
      //     return res.status(404).json({
      //       error: "not found"
      //     })
      //   }

      // for (let i = 0; i < troducts.length; i++) {

      const Pro = await sales.findByIdAndUpdate(_id, {
        soldProducts: req.body.soldProducts,
        subTotal: req.body.subTotal,
        discount: req.body.discount,
        netAmount: req.body.netAmount,
      });
      if (!Pro) {
        return res.status(404).json({
          error: "not found",
        });
      }
      console.log(Pro);
      // }

      return res.status(200).json({
        message: "The sale has been updated",
      });
    } else {
      return res.status(401).json("you have no access for this route");
    }
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      message: "The sale not updated",
      err,
    });
  }
};

exports.deleteSale = async function (req, res) {
  try {
    if (req.access.sellDelete) {
      let _id = req.params.id;
      console.log("id is : ", _id);

      let deleteSupplierData = await sales.findById({
        _id: req.params.id,
        deleted: false,
      });
      if (!deleteSupplierData || deleteSupplierData.deleted === true) {
        return res.status(404).json({
          error: "This ID does not exist",
        });
      }
      console.log(deleteSupplierData);

      deleteSupplierData.deleted = true;
      await deleteSupplierData.save();
      return res.status(200).json({
        message: "The sale has been deleted",
        deleteSupplierData,
      });
    } else {
      return res.status(401).json("you have no access for this route");
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: "Delete function's try block is not working",
    });
  }
};

exports.totalSales = async function (req, res) {
  try {
    let totalSales = await sales.find({}, "soldProducts");
    console.log("kkkkkk", totalSales);
    let salesArr = [];
    for (let i = 0; i < totalSales.length; i++) {
      salesArr.push(totalSales[i].soldProducts);
    }
    console.log("llllll", salesArr[0][0]);

    let salesSumm = await summaryOfSales.find({
      soldProducts: req.body.soldProducts,
    });
    console.log("SALES SUMM ARE AS FOLLOWS", salesSumm);
    if (salesSumm.length) {
      let count = responce[0].count + 1;
      console.log("new count", count);
      salesSumm = summaryOfSales.updateOne(
        { _id: responce[0]._id },
        { $set: { count: count } }
      );
      return res.status(200).json({
        message: "Sales summary updated",
        salesSumm,
      });
    }

    return res.status(401).json({
      message: "Sales have not been updated",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error occured in total sales in cashier controller",
    });
  }
};

exports.salesDetails = async function (req, res) {
  try {
    let salesDetail = await sales
      .find({ storeId: req.store }, "invoiceNo")
      .count();
    console.log("Sales Details are as follows", salesDetail);
    let salesArr = [];

    // for (let i = 0; i < salesDetail.length; i++) {
    //   salesArr.push(salesDetail[i].soldProducts);
    // }
    // console.log("UMMMMMMMM", salesArr);
    if (salesDetail) {
      return res.status(200).json({
        message: "Sales details are found",
        salesDetail,
      });
    } else {
      return res.status(404).json({
        message: "Sales details are not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "An error occured",
    });
  }
};
