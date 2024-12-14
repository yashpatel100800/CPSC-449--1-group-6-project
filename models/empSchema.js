const mongoose = require("mongoose");
const moment = require("moment-timezone");

const empSchema = new mongoose.Schema(
  {
    emp_name: { type: String, required: true },
    emp_phone: { type: Number, required: true },
    emp_mail: { type: String, required: true },
    emp_designation: { type: String, required: true },
    emp_salary: { type: Number, required: true },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
  },
  { timestamps: true }
);

empSchema.set("toObject", {
  transform: (doc, ret, options) => {
    ret.createdAt = moment(ret.createdAt).tz("Asia/Kolkata").format();
    ret.updatedAt = moment(ret.updatedAt).tz("Asia/Kolkata").format();
    return ret;
  },
});

empSchema.set("toJSON", {
  transform: (doc, ret, options) => {
    ret.createdAt = moment(ret.createdAt).tz("Asia/Kolkata").format();
    ret.updatedAt = moment(ret.updatedAt).tz("Asia/Kolkata").format();
    return ret;
  },
});

const Employee = mongoose.model("Employee", empSchema);

module.exports = Employee;
