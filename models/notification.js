const mongoose = require("mongoose");

const { Schema } = mongoose;
const notificationschema = new Schema({
  Title: {
    type: String,
    require: true,
  },

  Description: {
    type: String,
    require: true,
  },
  product_id: {
    type: String,
    require: true,
  },

  seenby: [],
  store_id: {
    type: String,
    require: true,
  },
  role: [],

  Date: {
    type: Date,
    default: Date.now,
  },
});
const stores = mongoose.model("notification", notificationschema);

module.exports = stores;
