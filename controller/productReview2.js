const review = require("../models/productReview");
const sales = require("../models/saleModel");
const config=require('../config');

/**
 * Function to get total number of products sold
 * along with product id and count
 */
exports.productCount = async function (req, res) {
  try {
    console.log(req.store);
    let store = await review.find({ store_id: req.store });
    console.log("Store",store);
    // find existing sales from DB.
    
    let sale = await sales.find({ storeId: req.store });
    // console.log(sale);
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
    // console.log(arr);
    // create array of objet with ID as key and ID (Number of time same id repeat) count as value.
    arr.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
    console.log(counts);
    const prod = Object.keys(counts);
    const val = Object.values(counts);

    for (let i = 0; i < prod.length; i++) {
    arr2.push({
      id:   prod[i],
      count: val[i]
    });
    }
    console.log(arr2);

    // empty review collection before inserting latest trending products.
    // await review.deleteMany({});
    // console.log("Deleted now create");

    if(store==null){
      console.log("if");
      // Create review collection in DB with key value pairs.
    // for (let i = 0; i < prod.length; i++) {
      await review.create({
        // count: val[i],
        // product: prod[i],
        store_id: req.store,
        soldProducts: counts,
      });
    // }
    }else{
      console.log("else");
      let sheraz=await review.updateOne({store_id: req.store}, { $set: { soldProducts: counts } })
      console.log(sheraz);
    }


     // set count to -1 to get result in descending order.
    var sort = { count: -1 };
    // Find, Sort and Limit total products to be displayed.
    // (config.test.bestSelling) is the number of products you want to display.
    // let best = await review.find().sort(sort).limit(config.test.bestSelling);
    let best= arr2.sort(function(a, b){return b.count - a.count})
    console.log();

    return res.status(200).json({
      message: "Count of Products",
      Total: best,
    });

    // return response if successfull
    // return res.status(200).json({
    //   message: "Total Reviews of Products",
    //   Populated: sale,
    // });
  } catch (error) {
    return res.status(404).json({
      error: "Review is not found",
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
