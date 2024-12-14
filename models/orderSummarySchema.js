const mongoose = require("mongoose");

const orderSummarySchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    totalSales: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  },
  { timestamps: true }
);

const OrderSummary = mongoose.model("OrderSummary", orderSummarySchema);

module.exports = OrderSummary;
