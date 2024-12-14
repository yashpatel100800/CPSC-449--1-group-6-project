const Inventory = require("../models/inventorySchema");

// Add a new inventory item
const addInventoryItem = async (req, res) => {
  try {
    const inventoryItem = await Inventory.create(req.body);
    res.status(201).json(inventoryItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Get all inventory items for a specific restaurant
const getInventoryByRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const inventoryItems = await Inventory.find({ restaurant: restaurantId });
    res.status(200).json(inventoryItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Update an inventory item by ID
const updateInventoryItem = async (req, res) => {
  try {
    const inventoryId = req.params.id;
    const updatedItem = await Inventory.findByIdAndUpdate(
      inventoryId,
      req.body,
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: "Inventory item not found" });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete an inventory item by ID
const deleteInventoryItem = async (req, res) => {
  try {
    const inventoryId = req.params.id;
    const deletedItem = await Inventory.findByIdAndDelete(inventoryId);

    if (!deletedItem) {
      return res.status(404).json({ error: "Inventory item not found" });
    }

    res.status(200).json({ message: "Inventory item deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  addInventoryItem,
  getInventoryByRestaurant,
  updateInventoryItem,
  deleteInventoryItem,
};
