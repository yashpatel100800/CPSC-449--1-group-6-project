const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const { verifyToken } = require("../routes/verifyTokens");

// Routes
router.get("/all/:id", verifyToken, getAllOrders);
router.get("/:id", verifyToken, getOrderById);
router.put("/:id", verifyToken, updateOrder);
router.delete("/:id", verifyToken, deleteOrder);

module.exports = router;
