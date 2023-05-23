const addSupplier = require("../models/supplierAdd");
const summaryOfSuppliers = require("../models/supplierSummary");
// const users = require("../models/users");
const countryModels = require("../models/countries");

exports.findSupplierSummary = async function (req, res) {

  try {
    let suppSumm = await summaryOfSuppliers.find({
      storeId: req.store,
    });
    // console.log(" IS AS FOLLOWS", suppSumm);
  
    let cityArr = [];
    let countArr = [];
    let countryArr = [];
    for (let i = 0; i < suppSumm.length; i++) {
      cityArr.push(suppSumm[i].cities);
      countArr.push(suppSumm[i].count);
      countryArr.push(suppSumm[i].country);
    }
    let cityArray = cityArr.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    });
    let countryArray = countryArr.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    });
    // console.log(
    //   "HOOOOOHOOOOOHAAAAAAA",
    //   cityArray,
    //   countArr,
    //   suppSumm,
    //   countryArray
    // );
    return res.status(200).json({
      message: "Summary is found",
      cityArray,
      suppSumm,
      countArr,
      countryArray,
    });
  } catch (error) {
      return res.status(401).json({
        error: "something went wrong"
      })
  }
  // console.log(" IS AS FOLLOWS");
 
};
