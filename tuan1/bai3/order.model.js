const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  email: { type: String, required: true },
  total: { type: Number, required: true },
  status: { type: String, default: "processing" },
  emailSent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("OrderEmail", OrderSchema);
