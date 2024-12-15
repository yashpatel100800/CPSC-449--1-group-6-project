const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/authController");

// Routes
router.post("/create", restaurantController.createRestaurant);
router.post("/send-sms", restaurantController.sendSms);
router.post("/verify-otp", restaurantController.verifyOtp);

module.exports = router;
