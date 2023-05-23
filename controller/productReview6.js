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
    let store = await review.find({ store_id: req.store });
    // console.log("store",store);

    // find existing sales from DB.
    let sdt = await storeDB.find({ _id: req.store });
    // console.log("store DB",sdt);

    let sale = await sales.find({ storeId: req.store });

    const counts = {};
    const arr = [];
    const arr2=[];

    // empty array if already filled.
    while (arr.length > 0) {
      arr.pop();
    }

    // push product ID into array form sales collection.
    for (let i = 0; i < sale.length; i++) {
      arr.push(sale[i].soldProducts[0]._id);
    }

    // create array of objet with ID as key and ID (Number of time same id repeat) count as value.
    arr.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
    const prod = Object.keys(counts);
    const val = Object.values(counts);

    // Assigning keys to values
    // Id to products ids
    // Count to number of duplicate products
    for (let i = 0; i < prod.length; i++) {
    arr2.push({
      id:   prod[i],
      count: val[i]
    });
    }
    // console.log(arr2);
    const lmt=[];
    
    // if store length is equal to zero
    if(store.length == 0 && sdt.length != 0){
      // Create review collection in DB.
      console.log("if");
      await review.create({
        store_id: req.store,
        soldProducts: arr2,
      });

      // Find, Sort and Limit total products to be displayed.
      // (config.test.bestSelling) is the number of products you want to display.
      let best= arr2.sort(function(a, b){return b.count - a.count})
      console.log("best",best);

      // get product details against ID
      for (let i = 0; i < config.test.bestSelling; i++) {
        if (best[i] == undefined) {
          break;
        }
        let product = await products.find({ _id: best[i].id });
        lmt.push(product[0]);
        console.log("all products", product[0]);
      }

      return res.status(201).json({
        message: "Best Selling Added",
        Total: lmt,
      });
    }else if(store.length > 0){
      // Else update existing count of products
      console.log("else if");
      let upOne=await review.updateOne({store_id: req.store}, { $set: { soldProducts: arr2 } })

      // Find, Sort and Limit total products to be displayed.
      // (config.test.bestSelling) is the number of products you want to display.
      let best= arr2.sort(function(a, b){return b.count - a.count})
      console.log("best",best);
      
      // get product details against ID
      for (let i = 0; i < config.test.bestSelling; i++) {
        if (best[i] == undefined) {
          break;
        }
        let product = await products.find({ _id: best[i].id });
        lmt.push(product[0]);
        console.log("all products", product[0]);
      }
      
      return res.status(200).json({
        message: "Best Selling Updated",
        Total: lmt,
      });
    }else{
      console.log("else");
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

/**
 * Function to get trending products in descending order.
 * According to their count.
 */
exports.bestSelling = async function (req, res) {
  try {
    // set count to -1 to get result in descending order.
    var sort = { count: -1 };
    // Find, Sort and Limit total products to be displayed.
    // (config.test.bestSelling) is the number of products you want to display.
    let best = await review.find().sort(sort).limit(config.test.bestSelling);

    return res.status(200).json({
      message: "Count of Products",
      Total: best,
    });
  } catch (error) {
    return res.status(404).json({
      error: "Review is not found",
    });
  }
};
