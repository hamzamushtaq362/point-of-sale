const mongoose = require("mongoose");
const { Schema } = mongoose;
const Sales = new Schema({
 
  invoiceNo :{
    type: String,
    require: true,
  },
  soldProducts:[],

  subTotal: {
    type: String,
    require: true,
  },
  discount:{
    type:String,
    require: true
  },
  netAmount: {
    type: Number,
    require: true,
  },
  storeId:{
    type:String,
    require:true,
  },
  userId:{
    type:String,
    require:true,
  },
  deleted: {
    type: Schema.Types.Boolean,
    index: true,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  
});
const soldProducts = mongoose.model("sales", Sales);

module.exports = soldProducts;
