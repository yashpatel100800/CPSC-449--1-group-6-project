const mongoose = require("mongoose");
const moment = require("moment-timezone");

const deliverySchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    order_items: [
      {
        foodItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "FoodItem",
        },
        quantity: { type: Number },
        foodInstruction: { type: String },
      },
    ],
    Address: { type: String },
    orderUpdate: { type: String },
    paymentMode: { type: String }, // dropdown card,cash, Gpay
    billGeneration: { type: Boolean, default: false }, //pdf generate
    delivery_person: { type: String },
    order_type: { type: String }, //pickup , delivery
    // orderCancel: { type: Boolean, default: false },
    order_total: { type: Number },
  },
  { timestamps: true }
);

deliverySchema.set("toObject", {
  transform: (doc, ret, options) => {
    ret.createdAt = moment(ret.createdAt).tz("Asia/Kolkata").format();
    ret.updatedAt = moment(ret.updatedAt).tz("Asia/Kolkata").format();
    return ret;
  },
});

deliverySchema.set("toJSON", {
  transform: (doc, ret, options) => {
    ret.createdAt = moment(ret.createdAt).tz("Asia/Kolkata").format();
    ret.updatedAt = moment(ret.updatedAt).tz("Asia/Kolkata").format();
    return ret;
  },
});
const Delivery = mongoose.model("Delivery", deliverySchema);

module.exports = Delivery;
