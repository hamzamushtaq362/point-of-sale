const review = require("../models/productReview");
const sales = require("../models/saleModel");
const products = require("../models/addproductmodel");
const config=require('../config');
const storeDB = require('../models/storeModel');
/**
 * Function to get total number of products sold
 * along with product id and count
 */
exports.productCount = async function (req, res) {
  try {
    // Chack if store exist in DB
    let sdt = await storeDB.find({ _id: req.store });
    // find existing sales from DB.
    let sale = await sales.find({ storeId: req.store });

    const arr = [];
    const lmt=[];
    // push product ID into array form sales collection.
    for (let i = 0; i < sale.length; i++) {
      arr.push({
        id:sale[i].soldProducts[0]._id,
        quantity:Number(sale[i].soldProducts[0].newQuantity)
      });
    }
    console.log("arr",arr);

    // Find Duplicate and add their quantity to get total quantity sold
    const result = arr.reduce((acc, { id, quantity }) => {
      const existingItem = acc.find(item => item.id === id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        acc.push({ id, quantity });
      }
      return acc;
    }, []);
    console.log(result);
    
    // if store length is equal to zero
    if(sdt.length != 0){
      // Find, Sort and Limit total products to be displayed.
      // (config.test.bestSelling) is the number of products you want to display.
      let best= result.sort(function(a, b){return b.quantity - a.quantity})

      // get product details against ID
      for (let i = 0; i < config.test.bestSelling; i++) {
        if (best[i] == undefined) {
          break;
        }
        let product = await products.find({ _id: best[i].id });
        lmt.push(product[0]);
        console.log("all products", product[0]);
      }

      // Response to Request
      return res.status(201).json({
        message: "Best Selling Added",
        Total: lmt,
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