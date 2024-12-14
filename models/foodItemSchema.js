const mongoose = require("mongoose");
const moment = require("moment-timezone");

const foodItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    item_type: { type: String, required: true },
    inventory_requirement: { type: String },
    code: { type: String },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
  },
  { timestamps: true }
);

foodItemSchema.set("toObject", {
  transform: (doc, ret, options) => {
    ret.createdAt = moment(ret.createdAt).tz("Asia/Kolkata").format();
    ret.updatedAt = moment(ret.updatedAt).tz("Asia/Kolkata").format();
    return ret;
  },
});

foodItemSchema.set("toJSON", {
  transform: (doc, ret, options) => {
    ret.createdAt = moment(ret.createdAt).tz("Asia/Kolkata").format();
    ret.updatedAt = moment(ret.updatedAt).tz("Asia/Kolkata").format();
    return ret;
  },
});

const FoodItem = mongoose.model("FoodItem", foodItemSchema);

module.exports = FoodItem;
