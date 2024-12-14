const mongoose = require("mongoose");
const moment = require("moment-timezone");

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    pincode: { type: Number, required: true },
    contact: { type: Number, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    tables: [{ type: mongoose.Schema.Types.ObjectId, ref: "Table" }],
    block: { type: Boolean, default: false },
    plan: [
      {
        startDate: {
          type: Date,
        },
        endDate: {
          type: Date,
        },
        paymentMode: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

restaurantSchema.set("toObject", {
  transform: (doc, ret, options) => {
    ret.createdAt = moment(ret.createdAt).tz("Asia/Kolkata").format();
    ret.updatedAt = moment(ret.updatedAt).tz("Asia/Kolkata").format();
    return ret;
  },
});

restaurantSchema.set("toJSON", {
  transform: (doc, ret, options) => {
    ret.createdAt = moment(ret.createdAt).tz("Asia/Kolkata").format();
    ret.updatedAt = moment(ret.updatedAt).tz("Asia/Kolkata").format();
    return ret;
  },
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
