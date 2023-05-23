const mongoose = require("mongoose");
const { Schema } = mongoose;
const addProducts = new Schema({
  image_no: {
    type: String,
    required: true,
  },
  product_image: {
    type: String,
    required: true,
  },
  barcode_id: {
    type: String,
    require: true,

  },
  product_name: {
    type: String,
    require: true,
  },
  product_price: {
    type: Number,
    require: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product_category',
    require: true,
  },
  size: {
    type: String,
    require: true,
  },
  quantity: {
    type: Number,
    require: true,
  },
  user_id: {
    type: String,
    require: true,
  },
  store_id:{
    type:String,
    require:true,

  },
  date: {
    type: Date,
    default: Date.now,
    timestamps: true 
  },
});
const products = mongoose.model("products", addProducts);

module.exports = products;
