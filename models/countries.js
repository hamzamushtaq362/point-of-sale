const mongoose = require("mongoose");

const { Schema } = mongoose;
const country = new Schema(
  {
    countryName: {
      type: String,
      require: true,
      default: null,
      // toJSON: {
      //   virtuals: true,
      // },
    },
  },
  { timestamps: true }
  // { typeKey: "$type" }
);
// country.virtual("suppliers", {
//   ref: "suppliers",
//   foreignField: "country",
//   localField: "_id",
// });
const countries = mongoose.model("countries", country);

module.exports = countries;
