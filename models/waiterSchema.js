const mongoose = require("mongoose");
const moment = require("moment-timezone");
const bcrypt = require("bcrypt");

const waiterSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    password: {
      type: String,
      required: [true, "password is required!!"],
    },
    contact: {
      type: Number,
      required: [true, "phone no is required"],
      unique: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    isBlock: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

waiterSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

waiterSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

waiterSchema.set("toObject", {
  transform: (doc, ret, options) => {
    ret.createdAt = moment(ret.createdAt).tz("Asia/Kolkata").format();
    ret.updatedAt = moment(ret.updatedAt).tz("Asia/Kolkata").format();
    console.log("Original createdAt:", ret.createdAt);
    ret.createdAt = moment(ret.createdAt).tz("Asia/Kolkata").format();
    console.log("Formatted createdAt:", ret.createdAt);
    return ret;
  },
});

waiterSchema.set("toJSON", {
  transform: (doc, ret, options) => {
    ret.createdAt = moment(ret.createdAt).tz("Asia/Kolkata").format();
    ret.updatedAt = moment(ret.updatedAt).tz("Asia/Kolkata").format();
    return ret;
  },
});
const Waiter = mongoose.model("Waiter", waiterSchema);

module.exports = Waiter;
