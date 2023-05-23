const barcode = require("../models/barcode");
const storeDB = require('../models/storeModel');
/**
 * Function to get total number of products sold
 * along with product id and count
 */
exports.barcode = async function (req, res) {
  try {
    // Chack if store exist in DB
    let sdt = await storeDB.find({ _id: req.store });
    let name=req.body.barcodeName;
    let getKey=req.body.barcodeKey;
    
    // if store length is equal to zero
    if(sdt.length != 0){

        await barcode.create({
            barcode_name: name,
            key: getKey,
            store_id: req.store
        });
      // Response to Request
      return res.status(201).json({
        message: "Barcode Added",
      });
    }
    else{
      return res.status(404).json({
        error: "Invalid Store",
      });
    }

  } catch (error) {
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};