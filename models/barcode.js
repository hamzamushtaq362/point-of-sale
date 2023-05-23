const mongoose = require("mongoose");
const { Schema } = mongoose;
const barcode = new Schema({
    barcode_name: {
        type: String,
        require: true,
    },
    key: {
        type: String,
        require: true,
    },
    store_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stores',
    },
    date: {
        type: Date,
        default: Date.now,
        timestamps: true
    }
});
const barcodes = mongoose.model("barcodes", barcode);

module.exports = barcodes;
