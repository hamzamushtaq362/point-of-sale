const mongoose = require("mongoose");

const { Schema } = mongoose;

const salesSummary = new Schema(
  {
    invoiceNo: { type: String, require: true },
    count: { type: Number, default: 0 },
    storeId: { type: Schema.Types.ObjectId, ref: "stores", require: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const salesSummaries = mongoose.model("salesSummaries", salesSummary);

module.exports = salesSummaries;
