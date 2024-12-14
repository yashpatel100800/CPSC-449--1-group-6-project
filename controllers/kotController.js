const Kot = require("../models/kotmodel");

// Get all KOTs for a specific restaurant and status
const getAllKots = async (req, res) => {
  try {
    const { status } = req.body; // Assuming status comes from the body
    const restaurantId = req.params.id;

    const kots = await Kot.find({ restaurant: restaurantId, status: status })
      .populate({
        path: "restaurant",
        model: "Restaurant",
        select: "name",
      })
      .populate({
        path: "order_items.foodItem",
        model: "FoodItem",
        options: { strictPopulate: false },
      });

    if (!kots || kots.length === 0) {
      return res.status(404).json({ message: "No current orders" });
    }

    res.status(200).json(kots);
  } catch (error) {
    console.error("Error fetching KOTs:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get a specific KOT by its ID
const getKotById = async (req, res) => {
  try {
    const kotId = req.params.id;

    const kot = await Kot.findById(kotId)
      .populate({
        path: "restaurant",
        model: "Restaurant",
        select: "name",
      })
      .populate({
        path: "order_items.foodItem",
        model: "FoodItem",
        select: "name",
        options: { strictPopulate: false },
      });

    if (!kot) {
      return res.status(404).json({ message: "KOT not found" });
    }

    res.status(200).json(kot);
  } catch (error) {
    console.error("Error fetching KOT:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update a KOT by its ID
const updateKot = async (req, res) => {
  try {
    const kotId = req.params.id;

    const updatedKot = await Kot.findByIdAndUpdate(kotId, req.body, {
      new: true,
    });

    if (!updatedKot) {
      return res.status(404).json({ message: "KOT not found" });
    }

    res.status(200).json(updatedKot);
  } catch (error) {
    console.error("Error updating KOT:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a KOT by its ID
const deleteKot = async (req, res) => {
  try {
    const kotId = req.params.id;

    const deletedKot = await Kot.findByIdAndDelete(kotId);

    if (!deletedKot) {
      return res.status(404).json({ message: "KOT not found" });
    }

    res.status(200).json({ message: "KOT deleted successfully", deletedKot });
  } catch (error) {
    console.error("Error deleting KOT:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllKots,
  getKotById,
  updateKot,
  deleteKot,
};
