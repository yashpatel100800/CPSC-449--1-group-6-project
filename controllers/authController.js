const Restaurant = require("../models/restaurantSchema");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const apiKey = process.env.TEXT_API_KEY;
const senderName = "Restaurant";
const otpSessionDuration = 3 * 60 * 1000; // 3 minutes in milliseconds
const otpSessions = {};

// Create a new restaurant
exports.createRestaurant = async (req, res) => {
  try {
    const currentDate = new Date();
    const endDate = new Date(currentDate);
    endDate.setFullYear(currentDate.getFullYear() + 1);

    const newRestaurant = new Restaurant({
      name: req.body.name,
      address: req.body.address,
      pincode: req.body.pincode,
      contact: req.body.contact,
      email: req.body.email,
      category: req.body.category,
      restaurant_age: req.body.restaurant_age,
      plan: [
        {
          startDate: currentDate,
          endDate: endDate,
          paymentMode: req.body.paymentMode,
        },
      ],
    });

    const savedRestaurant = await newRestaurant.save();
    res.status(201).json({
      message: "Restaurant and subscription added successfully",
      restaurant: savedRestaurant,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Send OTP via SMS
exports.sendSms = async (req, res) => {
  const { contact } = req.body;
  const verificationCode = generateVerificationCode();
  console.log(verificationCode);

  try {
    await sendSMS(contact, verificationCode);
    otpSessions[contact] = {
      code: verificationCode,
      createdAt: new Date(),
    };
    res.json({ success: true, message: "SMS sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error sending SMS" });
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { contact, otp } = req.body;
    const otpSession = otpSessions[contact];

    if (
      otpSession &&
      otpSession.code === otp &&
      isOtpSessionValid(otpSession.createdAt)
    ) {
      const resto = await Restaurant.findOne({ contact: contact });
      if (!resto) {
        throw { status: 404, message: "Restaurant not found" };
      }
      if (resto.block) {
        throw { status: 400, message: "Contact Admin!" };
      }
      const accessToken = jwt.sign({ id: resto._id }, process.env.JWT_SEC, {
        expiresIn: "7d",
      });

      res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      res.status(200).json({
        success: true,
        message: "OTP verified successfully",
        resto,
        accessToken,
      });

      delete otpSessions[contact];
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid OTP or session expired" });
    }
  } catch (error) {
    res
      .status(error.status || 400)
      .json({ success: false, message: error.message });
  }
};

// Helper function: Send SMS
async function sendSMS(phoneNumber, verificationCode) {
  try {
    const message = `Your OTP for verification is: ${verificationCode}`;
    const url = "https://api.textlocal.in/send/";

    const response = await axios.post(url, {
      apiKey: apiKey,
      numbers: phoneNumber,
      message: message,
      sender: senderName,
      test: true,
    });

    console.log("Response is:", response.data);
    return response;
  } catch (error) {
    console.error("Error sending SMS:", error.message);
    throw error;
  }
}

// Helper function: Generate Verification Code
function generateVerificationCode() {
  return "0000"; // Replace with actual logic for random generation
  // return Math.floor(1000 + Math.random() * 9000).toString();
}

// Helper function: Check if OTP session is valid
function isOtpSessionValid(createdAt) {
  const currentTime = new Date().getTime();
  return currentTime - new Date(createdAt).getTime() <= otpSessionDuration;
}
