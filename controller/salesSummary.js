const sales = require("../models/saleModel");
const summaryOfSales = require("../models/salesSummary");

exports.salesSummary = async function (req, res) {
  try {
    let totalSummary = await summaryOfSales
      .find({ storeId: req.store })
      .count();
    let salesSumm = await summaryOfSales.find({ storeId: req.store });
    console.log("SUMMARY IS AS FOLLOWS", salesSumm);
    let salesArr = [];
    for (let i = 0; i < salesSumm.length; i++) {
      salesArr.push(salesSumm[i].invoiceNo);
    }
    console.log("New Array is made", salesArr);
    return res.status(200).json({
      message: "Summary is found",
      salesArr,
      salesSumm,
      totalSummary,
    });
  } catch (error) {
    return res.status(404).json({
      error: "Summary is not found",
    });
  }
};
