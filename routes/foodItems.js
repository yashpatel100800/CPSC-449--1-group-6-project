const express = require("express");
const router = express.Router();
const {
  addFoodItem,
  getFoodItemsByRestaurant,
  getFoodItemById,
  updateFoodItem,
  deleteFoodItem,
} = require("../controllers/foodItemController");
const { verifyToken } = require("../routes/verifyTokens");

// Routes
router.post("/add", verifyToken, addFoodItem);
router.get("/restaurant/:id", verifyToken, getFoodItemsByRestaurant);
router.get("/item/:id", verifyToken, getFoodItemById);
router.put("/update/:id", verifyToken, updateFoodItem);
router.delete("/delete/:id", verifyToken, deleteFoodItem);

module.exports = router;
