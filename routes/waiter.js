const express = require("express");
const {
  createWaiter,
  loginWaiter,
  updateWaiter,
  getWaiterById,
  getWaitersByRestaurant,
  deleteWaiter,
} = require("../controllers/waiterController");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../routes/verifyTokens");

const router = express.Router();

// Create new waiter
router.post("/create", createWaiter);

// Waiter login
router.post("/login", loginWaiter);

// Update waiter details
router.put("/:id", updateWaiter);

// Get waiter by ID
router.get("/:id", getWaiterById);

// Get waiters for a specific restaurant
router.get("/restaurant/:id", getWaitersByRestaurant);

// Delete waiter by ID
router.delete("/:id", deleteWaiter);

module.exports = router;
