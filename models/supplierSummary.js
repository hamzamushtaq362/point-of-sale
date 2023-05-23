const mongoose = require("mongoose");

const { Schema } = mongoose;

const supplierSummary = new Schema(
  {
    // country: { type: Schema.Types.ObjectId, ref: "suppliers", require: true },
    country: { type: String, require: true },
    cities: { type: String, require: true },
    count: { type: Number, default: 0 },
    storeId: { type: Schema.Types.ObjectId, ref: "stores", require: true },
  },
  { timestamps: true }
);

const supplierSummaries = mongoose.model("supplierSummaries", supplierSummary);

module.exports = supplierSummaries;
