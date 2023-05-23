const mongoose = require("mongoose");
const { Schema } = mongoose;
const role = new Schema({
  role: {
    type: String,
    // enum : ['min','manager', 'cashier'],
    // default: null
  },
  permission_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "permissions",
    require: true,
    // default: null,
  },
});
const roles = mongoose.model("roles", role);

module.exports = roles;
