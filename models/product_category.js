const mongoose = require("mongoose");
const { Schema } = mongoose;
const category = new Schema(
  {  
  category: {
    type: String,
    require: true,
    default: null,
  }
  },
  { timestamps: true }
);
const products = mongoose.model("product_category", category);

module.exports = products;
