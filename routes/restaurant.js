const express = require("express");
const router = express.Router();
const { 
  getAllRestaurants, 
  updateRestaurant, 
  deleteRestaurant 
} = require("../controllers/restaurantController");

const {
  verifyToken,
} = require("./verifyTokens");

// Route to get all restaurants
router.get("/all", verifyToken, getAllRestaurants);

// Route to update a restaurant by ID
router.put("/update/:id", verifyToken, updateRestaurant);

// Route to delete a restaurant by ID
router.delete("/delete/:id", verifyToken, deleteRestaurant);

module.exports = router;
