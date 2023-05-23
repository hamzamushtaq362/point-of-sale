const purchaseModel = require("../models/purchaseModel");
const purchaseSummary = require("../models/purchaseSummary");

exports.findPurchaseSummary = async function (req, res) {

  try {

    let purchaseSumm = await purchaseSummary.find({
      storeId: req.store,
    });
    // console.log(" IS AS FOLLOWS", suppSumm);
  
    let purchaseArr = [];
    let countArr = [];
    let netArr = [];
    for (let i = 0; i < purchaseSumm.length; i++) {
      purchaseArr.push(purchaseSumm[i].supplierName);
      countArr.push(purchaseSumm[i].count);
      netArr.push(purchaseSumm[i].netTotal);
    }
    let purchaseArray = purchaseArr.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    });
    let countArray = countArr.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    });
    let netArray = netArr.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    });
    console.log(
      "HOOOOOHOOOOOHAAAAAAA- PURCHASE ARRAYS ARE",
      purchaseArray,
      countArr,
      // suppSumm,
      netArray
    );
    return res.status(200).json({
      message: "Summary is found",
      purchaseArray,
      countArr,
      netArray,
    });
    
  } catch (error) {
      console.log(error);
      return res.status(401).json({
        error: "something went wrong"
      })
  }
  // console.log(" IS AS FOLLOWS");
 
};
