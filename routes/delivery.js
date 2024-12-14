const express = require("express");
const router = express.Router();
const {
  addDelivery,
  getDeliveriesByRestaurant,
  getDeliveryDetails,
  updateDelivery,
  getBill,
  processOrder,
} = require("../controllers/deliveryController");
const { verifyToken } = require("../routes/verifyTokens");

// Add new delivery
router.post("/add", verifyToken, addDelivery);

// Get deliveries by restaurant
router.get("/restaurant/:id", verifyToken, getDeliveriesByRestaurant);

// Get details of a specific delivery
router.get("/:id", verifyToken, getDeliveryDetails);

// Update delivery and KOT
router.put("/update/:id", verifyToken, updateDelivery);

// Get bill for delivery
router.get("/bill/:id", verifyToken, getBill);

// Process order and finalize delivery
router.put("/order/:id", verifyToken, processOrder);

module.exports = router;
