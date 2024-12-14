const mongoose = require("mongoose");
const moment = require("moment-timezone");

const InventorySchema = new mongoose.Schema(
  {
    item_name: { type: String, required: true },
    item_quantity: { type: String, required: true },
    item_price: { type: Number, required: true },
    item_category: { type: String, required: true },
    item_volume: { type: Number, required: true },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
  },
  { timestamps: true }
);

InventorySchema.set("toObject", {
  transform: (doc, ret, options) => {
    ret.createdAt = moment(ret.createdAt).tz("Asia/Kolkata").format();
    ret.updatedAt = moment(ret.updatedAt).tz("Asia/Kolkata").format();
    return ret;
  },
});

InventorySchema.set("toJSON", {
  transform: (doc, ret, options) => {
    ret.createdAt = moment(ret.createdAt).tz("Asia/Kolkata").format();
    ret.updatedAt = moment(ret.updatedAt).tz("Asia/Kolkata").format();
    return ret;
  },
});

const Inventory = mongoose.model("Inventory", InventorySchema);

module.exports = Inventory;
