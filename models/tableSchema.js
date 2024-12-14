const mongoose = require("mongoose");
const moment = require("moment-timezone");

const tableSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    table_items: [
      {
        foodItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "FoodItem",
        },
        quantity: { type: Number },
        foodInstruction: { type: String },
      },
    ],
    orderUpdate: { type: String },
    paymentMode: { type: String }, // dropdown card,cash, Gpay
    billGeneration: { type: Boolean, default: false }, //pdf generate
    tableVacancy: { type: Boolean, default: true },
    // orderCancel: { type: Boolean, default: false },
    tableType: { type: String, required: true },
    tableNumber: { type: String, required: true },
    order_total: { type: Number },
  },
  { timestamps: true }
);

tableSchema.set("toObject", {
  transform: (doc, ret, options) => {
    ret.createdAt = moment(ret.createdAt).tz("Asia/Kolkata").format();
    ret.updatedAt = moment(ret.updatedAt).tz("Asia/Kolkata").format();
    return ret;
  },
});

tableSchema.set("toJSON", {
  transform: (doc, ret, options) => {
    ret.createdAt = moment(ret.createdAt).tz("Asia/Kolkata").format();
    ret.updatedAt = moment(ret.updatedAt).tz("Asia/Kolkata").format();
    return ret;
  },
});
const Table = mongoose.model("Table", tableSchema);

module.exports = Table;
