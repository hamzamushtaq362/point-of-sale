const mongoose = require("mongoose");
const { Schema } = mongoose;
const superAdminlogin= new Schema({
  email: {
    type: String,
    require: true,
    unique: true
  },
  password: {
    type: String,
    require: true,
    unique: true
  }
});
const superadmin = mongoose.model("superadmins", superAdminlogin);

module.exports = superadmin;