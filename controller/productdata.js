const Data = require("../models/saleModel");
const Product = require("../models/addproductmodel");

// exports.sales = async (req, res) => {
//   try {
//     const data = await Data.find({});
//     let total = [];
//     let x = 0;
//     for (let i = 0; i < data.length; i++) {
//       total[i] = data[i].netAmount;
//       x += data[i].netAmount;
//     }
//     // console.log('Totals netamount amount', x);
//     return res.status(200).json({
//       message: "data found",
//       x,
//       total,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
// exports.amount = async (req, res) => {
//   try {
//     let total = [];
//     let date = [];
//     let x = 0;
//     const sales = await Product.find({});
//     for (let i = 0; i < sales.length; i++) {
//       total[i] = sales[i].product_price;
//       date[i] = sales[i].date;

//       x += sales[i].product_price;
//     }
//     console.log("Totals product amount", x);
//     return res.status(200).json({
//       message: "data found",
//       x,
//       total,
//       date,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// exports.mostSellingProduct = async function (req, res) {
//   let mostSold = await Product;
// };
