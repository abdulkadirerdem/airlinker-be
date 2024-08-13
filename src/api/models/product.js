const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  productUrl: { type: String, required: true },
  trackingStatus: {
    type: String,
    enum: ["Out of Stock", "In Stock", "Not Tracking"],
    default: "Not Tracking",
  },
});

const ProductModel = mongoose.model("Product", ProductSchema);

module.exports = { ProductModel };
