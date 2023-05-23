const mongoose = require("mongoose");
const { Schema } = mongoose;
const expense= new Schema({
  category: {
    type:mongoose.Schema.Types.ObjectId,
    ref:"expenseCategory",
    require:true,
  },
  amount:{
    type:Number,
    require:true,
  },
  date: {
    type: Date,
    default: Date.now,
  },

  billStatus:{
    type:String,
    require:true
  },
   store_Id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"stores",
    require:true,
   },
   description:{
    type:String,
    require:true
   },
   userId:{
    type:mongoose.Schema.Types.ObjectId,
    require:true
   },
});
const expenses= mongoose.model("expenses", expense);
module.exports = expenses;