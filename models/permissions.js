const mongoose = require("mongoose");

const { Schema } = mongoose;
const Access = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    require: true,
  },
  employeeAdd: {
    type: Boolean,
    default: false,
  },
  employeeView: {
    type: Boolean,
    default: false,
  },
  employeeUpdate: {
    type: Boolean,
    default: false,
  },
  employeeDelete: {
    type: Boolean,
    default: false,
  },
  purchaseAdd: {
    type: Boolean,
    default: false,
  },
  purchaseView: {
    type: Boolean,
    default: false,
  },
  purchaseUpdate: {
    type: Boolean,
    default: false,
  },
  purchaseDelete: {
    type: Boolean,
    default: false,
  },
  productAdd: {
    type: Boolean,
    default: false,
  },
  productView: {
    type: Boolean,
    default: false,
  },
  productUpdate: {
    type: Boolean,
    default: false,
  },
  productDelete: {
    type: Boolean,
    default: false,
  },
  supplierAdd: {
    type: Boolean,
    default: false,
  },
  supplierView: {
    type: Boolean,
    default: false,
  },
  supplierUpdate: {
    type: Boolean,
    default: false,
  },
  supplierDelete: {
    type: Boolean,
    default: false,
  },
  expenseAdd: {
    type: Boolean,
    default: false,
  },
  expenseView: {
    type: Boolean,
    default: false,
  },
  expenseUpdate: {
    type: Boolean,
    default: false,
  },
  expenseDelete: {
    type: Boolean,
    default: false,
  },
  storeAdd: {
    type: Boolean,
    default: false,
  },
  storeView: {
    type: Boolean,
    default: false,
  },
  storeUpdate: {
    type: Boolean,
    default: false,
  },
  storeDelete: {
    type: Boolean,
    default: false,
  },
  sellProduct: {
    type: Boolean,
    default: false,
  },
  sellView: {
    type: Boolean,
    default: false,
  },
  sellUpdate: {
    type: Boolean,
    default: false,
  },
  sellDelete: {
    type: Boolean,
    default: false,
  },
});

const access = mongoose.model("permissions", Access);
module.exports = access;
