const express = require("express");
const router = express.Router();
const {
  addInventoryItem,
  getInventoryByRestaurant,
  updateInventoryItem,
  deleteInventoryItem,
} = require("../controllers/inventoryController");
const { verifyToken } = require("../routes/verifyTokens");

// Routes
router.post("/add", verifyToken, addInventoryItem);
router.get("/restaurant/:id", verifyToken, getInventoryByRestaurant);
router.put("/:id", verifyToken, updateInventoryItem);
router.delete("/:id", verifyToken, deleteInventoryItem);

module.exports = router;
