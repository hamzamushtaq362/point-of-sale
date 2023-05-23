const mongoose = require("mongoose");

const { Schema } = mongoose;
const storeSchema = new Schema({
  storeName: {
    type: String,
    require: true,
  },
  
  branchName: {
    type: String, 
    require: true
  },
  storePhone: {
    type: String,
    require: true,
  },
  storeAddress: {
    type: String,
    require: true,
  }, 
  ownerId : {
    type : String,
    require: true,
  },

});
const stores = mongoose.model("stores", storeSchema);

module.exports = stores;
