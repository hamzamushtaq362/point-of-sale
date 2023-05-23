const productModel = require("../models/productSummary");
const product = require("../models/addproductmodel");

exports.findProductSummary = async function (req, res) {
  try {
    let prodCount = await product.find({ storeId: req.store }).count();
    let categorySumm = await productModel.find({
      store_id: req.store,
    });
    // console.log(" IS AS FOLLOWS", suppSumm);

    let categoryArr = [];
    let countArr = [];
    for (let i = 0; i < categorySumm.length; i++) {
      categoryArr.push(categorySumm[i].category);
      countArr.push(categorySumm[i].count);
    }
    let categoryArray = categoryArr.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    });

    console.log("HOOOOOHOOOOOHAAAAAAA", categoryArray, countArr);
    return res.status(200).json({
      message: "Summary is found",
      categoryArray,
      countArr,
      prodCount,
    });
  } catch (error) {
    return res.status(400).json({
      error: "Bad request",
    });
  }
};
