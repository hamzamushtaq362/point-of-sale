const mongoose = require("mongoose");

const countryAdd = require("../models/countries");

const { Schema } = mongoose;
const addSupplier = new Schema(
  {
    supplierName: {
      type: String,
      require: true,
    },
    supplierLastName: {
      type: String,
      require: true,
    },
    contact: {
      type: String,
      require: true,
    },
    emailSupplier: {
      type: String,
      require: true,
      // unique: true,
    },
    country: { type: Schema.Types.ObjectId, ref: "countries" },
    city: {
      type: String,
      require: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    storeId: {
      type: Schema.Types.ObjectId,
      ref: "stores",
    },
    deleted: {
      type: Schema.Types.Boolean,
      index: true,
      default: false,
    },
  },
  { timestamps: true }
);

const suppliers = mongoose.model("suppliers", addSupplier);

module.exports = suppliers;
