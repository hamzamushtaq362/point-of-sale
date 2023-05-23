const mongoose = require("mongoose");

const { Schema } = mongoose;

const purchaseSummary = new Schema(
  {
    supplierName: { type: String, require: true },
    netTotal: { type: Number, require: true },
    count: { type: Number, default: 0 },
    storeId: { type: Schema.Types.ObjectId, ref: "stores", require: true },
  },
  { timestamps: true }
);

const purchaseSummaries = mongoose.model("purchaseSummaries", purchaseSummary);

module.exports = purchaseSummaries;
