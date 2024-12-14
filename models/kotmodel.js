const mongoose = require("mongoose");
const moment = require("moment-timezone");

const kotschema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    source: {
      type: String,
    },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      // required: true,
    },
    order_items: [
      {
        type: "Object",
        required: true,
      },
    ],
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);
kotschema.set("toObject", {
  transform: (doc, ret, options) => {
    ret.createdAt = moment(ret.createdAt).tz("Asia/Kolkata").format();
    ret.updatedAt = moment(ret.updatedAt).tz("Asia/Kolkata").format();
    return ret;
  },
});

kotschema.set("toJSON", {
  transform: (doc, ret, options) => {
    ret.createdAt = moment(ret.createdAt).tz("Asia/Kolkata").format();
    ret.updatedAt = moment(ret.updatedAt).tz("Asia/Kolkata").format();
    return ret;
  },
});
const Kot = mongoose.model("Kot", kotschema);

module.exports = Kot;
