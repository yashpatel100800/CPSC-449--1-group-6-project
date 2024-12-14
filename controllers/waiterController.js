const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Waiter = require("../models/waiterSchema");

// Create new waiter
const createWaiter = async (req, res) => {
  try {
    const waiter = new Waiter(req.body);
    await waiter.save();
    res.status(200).json(waiter);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Waiter login
const loginWaiter = async (req, res) => {
  try {
    const { contact, password } = req.body;
    const user = await Waiter.findOne({ contact, isBlock: false });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid Password!" });
    }

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SEC,
      { expiresIn: "7d" }
    );

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.status(200).json({
      success: true,
      message: "Logged In successfully!!",
      user,
      accessToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Update waiter
const updateWaiter = async (req, res) => {
  try {
    const waiter = await Waiter.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!waiter) {
      return res.status(404).json({ error: "Waiter not found" });
    }
    res.status(200).json(waiter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get waiter by ID
const getWaiterById = async (req, res) => {
  try {
    const waiter = await Waiter.findById(req.params.id);
    if (!waiter) {
      return res.status(404).json({ message: "Waiter not found" });
    }
    res.status(200).json({
      message: "Success",
      waiter,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    res.status(500).json({ error: error.message });
  }
};

// Get waiters for a specific restaurant
const getWaitersByRestaurant = async (req, res) => {
  try {
    const waiters = await Waiter.find({ restaurant: req.params.id });
    if (!waiters || waiters.length === 0) {
      return res.status(404).json({ message: "No waiters found for restaurant!" });
    }
    res.status(200).json(waiters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete waiter by ID
const deleteWaiter = async (req, res) => {
  try {
    const waiter = await Waiter.findByIdAndDelete(req.params.id);
    if (!waiter) {
      return res.status(404).json({ message: "Waiter not found" });
    }
    res.status(200).json({
      message: "Waiter Deleted",
      waiter,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createWaiter,
  loginWaiter,
  updateWaiter,
  getWaiterById,
  getWaitersByRestaurant,
  deleteWaiter,
};
