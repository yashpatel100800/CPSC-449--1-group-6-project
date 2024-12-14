const mongoose = require("mongoose");
const moment = require("moment-timezone");

const orderSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    order_type: { type: "String" },
    items: [
      {
        foodItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "FoodItem",
        },
        quantity: { type: Number },
        foodInstruction: { type: String },
      },
    ],
    paymentMode: { type: "String" },
    orderStatus: {
      type: String,
      enum: ["pending", "success", "cancel"],
    },
    totalAmount: { type: Number },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
    },
  },
  { timestamps: true }
);
orderSchema.set("toObject", {
  transform: (doc, ret, options) => {
    ret.createdAt = moment(ret.createdAt).tz("Asia/Kolkata").format();
    ret.updatedAt = moment(ret.updatedAt).tz("Asia/Kolkata").format();
    console.log("Original createdAt:", ret.createdAt);
    ret.createdAt = moment(ret.createdAt).tz("Asia/Kolkata").format();
    console.log("Formatted createdAt:", ret.createdAt);
    return ret;
  },
});

orderSchema.set("toJSON", {
  transform: (doc, ret, options) => {
    ret.createdAt = moment(ret.createdAt).tz("Asia/Kolkata").format();
    ret.updatedAt = moment(ret.updatedAt).tz("Asia/Kolkata").format();
    return ret;
  },
});
const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
