const mongoose = require("mongoose");
const { Schema } = mongoose;
const addReviews = new Schema({
    count: {
        type: Number
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
    },
    date: {
        type: Date,
        default: Date.now,
        timestamps: true
    },
    store_id:{
        type:String,
    },
    soldProducts:[],
});
const productReviews = mongoose.model("product_reviews", addReviews);

module.exports = productReviews;
