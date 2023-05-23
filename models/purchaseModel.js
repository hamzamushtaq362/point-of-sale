const mongoose = require("mongoose");
const { Schema } = mongoose;
const purchaseProducts = new Schema({
  supplierName: {
    type: String,
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "suppliers",
    require: true,
  },
  billNumber: {
    type: String,
    require: true,
  },

  products: [],

  date: {
    type: Date,
    default: Date.now,
  },
  note: {
    type: String,
  },
  netTotal: {
    type: Number,
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "stores",
    require: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    require: true,
  },
});
const products = mongoose.model("purchases", purchaseProducts);

module.exports = products;
