const FoodItem = require("../models/foodItemSchema");

// Add new food Items to 
const addFoodItem = async (req, res) => {
  try {
    const foodItem = new FoodItem(req.body);
    await foodItem.save();
    res.status(201).json(foodItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get food items by restaurant ID
const getFoodItemsByRestaurant = async (req, res) => {
  try {
    const query = { restaurant: req.params.id };
    if (req.query.name) {
      query.name = { $regex: new RegExp(req.query.name, "i") };
    }
    if (req.query.code) {
      query.code = { $regex: new RegExp(req.query.code, "i") };
    }
    const foodItems = await FoodItem.find(query);
    res.status(200).json(foodItems);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get food item by ID
const getFoodItemById = async (req, res) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id);
    if (!foodItem) {
      res.status(404).json({ message: "Item not found" });
      return;
    }
    res.status(200).json(foodItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update food item by ID
const updateFoodItem = async (req, res) => {
  try {
    const foodItem = await FoodItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!foodItem) {
      res.status(404).json({ error: "Food Item not found" });
      return;
    }
    res.status(200).json(foodItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete food item by ID
const deleteFoodItem = async (req, res) => {
  try {
    const foodItem = await FoodItem.findByIdAndDelete(req.params.id);
    if (!foodItem) {
      res.status(404).json({ error: "Food Item not found" });
      return;
    }
    res.status(200).json({ message: "Food Item Deleted Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  addFoodItem,
  getFoodItemsByRestaurant,
  getFoodItemById,
  updateFoodItem,
  deleteFoodItem,
};
