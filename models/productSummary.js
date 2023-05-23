const mongoose = require("mongoose");

const { Schema } = mongoose;

const productSummary = new Schema(
  {
    // country: { type: Schema.Types.ObjectId, ref: "suppliers", require: true },
    category: { type: String, require: true },
    count: { type: Number, default: 0 },
    storeId: { type: Schema.Types.ObjectId, ref: "stores", require: true },
  },
  { timestamps: true }
);

const productSummaries = mongoose.model("productSummaries", productSummary);

module.exports = productSummaries;
