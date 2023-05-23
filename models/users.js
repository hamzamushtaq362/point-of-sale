const mongoose = require("mongoose");

const { Schema } = mongoose;
const adminRegisterSchema = new Schema({
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    require: false,
    default: null,
  },
  contact: {
    type: Number,
    require: false,
    default: null,

  },


  email: {
    type: String,
    require: false,
    unique: true,
    default: null,
  },
  password: {
    type: String,
    require: false,
    default: null,
  },
  confirmPassword: {
    type: String,
    require: false,
    unique: false,
    default: null,
  },
  contact: {
    type: String,
    require: true,
  },
  role_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "roles",
    require: true,
  },
  country_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "countries",
    require: true,
    // default: null,
  },
  address: {
    type: String,
    require: false,
  },
  status: {
    type: String,
    require: false,
    default: "pending",
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "stores",
    require: false,
    default: null,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    require: false,
    default: null,
  },

  date: {
    type: Date,
    default: Date.now,
  },

  company: {
    type: String,
    require: false,
    default: null,
  },
  isDeleted: {
    type: Schema.Types.Boolean,
    index: true,
    default: false,
  },
});
const admins = mongoose.model("users", adminRegisterSchema);

module.exports = admins;
