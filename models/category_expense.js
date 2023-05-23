const mongoose = require("mongoose");

const { Schema } = mongoose;
const expenseCategories = new Schema({
  category:{
    type:String,
    require:true,
  }
})


const expenseCategory= mongoose.model("expenseCategory", expenseCategories);
module.exports = expenseCategory;