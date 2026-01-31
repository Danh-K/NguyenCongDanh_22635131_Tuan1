const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: String,
  items: Array,
  totalPrice: Number,
  status: {
    type: String,
    default: "CREATED"
  },
  shippingFee: Number
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);
