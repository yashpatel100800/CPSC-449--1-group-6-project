const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
app.use(cors());
app.use(express.json());
const Auth = require("./routes/Auth");
const restaurant = require("./routes/restaurant");
const table = require("./routes/table");
const foodItems = require("./routes/foodItems");
const order = require("./routes/order");
const orderSummary = require("./routes/orderSummary");
const inventory = require("./routes/inventory");
const Employee = require("./routes/emp");
const kot = require("./routes/kotroute");
const Delivery = require("./routes/delivery");
const Admin = require("./routes/Admin");
const Waiter = require("./routes/waiter");

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Db Connected");
  } catch (err) {
    console.log(err);
  }
})();
app.use("/auth", Auth);
app.use("/restaurant", restaurant);
app.use("/table", table);
app.use("/foodItem", foodItems);
app.use("/order", order);
app.use("/orderSummary", orderSummary);
app.use("/inventory", inventory);
app.use("/emp", Employee);
app.use("/kot", kot);
app.use("/delivery", Delivery);
app.use("/admin", Admin);
app.use("/waiter", Waiter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Backend is Working" });
});
app.listen(process.env.PORT || 8001, (req, res) => {
  console.log("Backend is running");
});
