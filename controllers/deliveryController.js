const Delivery = require("../models/deliverySchema");
const Restaurant = require("../models/restaurantSchema");
const Kot = require("../models/kotmodel");
const Order = require("../models/orderSchema");

// Add new delivery
const addDelivery = async (req, res) => {
  try {
    const { restaurant } = req.body;

    // Check if the restaurant exists
    const restaurantExist = await Restaurant.findById(restaurant);
    if (!restaurantExist) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    // Create a new delivery and associate it with the restaurant
    const newDelivery = new Delivery(req.body);
    await newDelivery.save();

    // Create KOT with new delivery information
    const kotData = {
      restaurant: newDelivery.restaurant,
      source: `Delivery [${newDelivery._id}]`,
      order_items: newDelivery.order_items,
      status: "pending",
    };

    const kot = await Kot.create(kotData);

    res.status(200).json({ delivery: newDelivery, kot });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Get deliveries by restaurant
const getDeliveriesByRestaurant = async (req, res) => {
  try {
    const deliveries = await Delivery.find({ restaurant: req.params.id });
    res.status(200).json(deliveries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get details of a specific delivery
const getDeliveryDetails = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
      .populate({ path: "restaurant", model: "Restaurant" })
      .populate({
        path: "order_items.foodItem",
        model: "FoodItem",
        select: "name price",
      });

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    res.json(delivery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update delivery and KOT
const updateDelivery = async (req, res) => {
  try {
    const deliveryId = req.params.id;
    const { order_items, ...others } = req.body;

    // If order_items is provided, create KOT
    const delivery = await Delivery.findById(deliveryId);
    let kot;
    if (order_items) {
      const kotData = {
        restaurant: delivery.restaurant,
        source: `Delivery [${deliveryId}]`,
        order_items,
        status: "pending",
      };

      kot = await Kot.create(kotData);
    }

    // Update other fields dynamically
    const updateFields = {
      $push: { order_items: { $each: order_items || [] } },
    };
    for (const key in others) {
      if (Object.prototype.hasOwnProperty.call(others, key)) {
        // Validate and update the corresponding field in the updateFields object
        if (Object.prototype.hasOwnProperty.call(Delivery.schema.obj, key)) {
          updateFields[key] = others[key];
        }
      }
    }

    // Find and update the delivery document
    const options = { new: true, upsert: true, runValidators: true };
    const updatedDelivery = await Delivery.findOneAndUpdate(
      { _id: deliveryId },
      updateFields,
      options
    );

    if (!updatedDelivery) {
      return res.status(404).json({ error: "Delivery not found" });
    }

    res.status(200).json({
      message: "Delivery information updated successfully",
      delivery: updatedDelivery,
      kot,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Get bill for delivery
const getBill = async (req, res) => {
  try {
    const Id = req.params.id;
    const delivery = await Delivery.findById(Id)
      .populate({
        path: "restaurant",
        model: "Restaurant",
        select: "name",
      })
      .populate({
        path: "order_items.foodItem",
        model: "FoodItem",
        select: "name price",
      });

    if (!delivery) {
      return res.status(404).json({ error: "Delivery not found" });
    }

    // Calculate the total amount based on table items
    const totalAmount = delivery.order_items.reduce((total, item) => {
      return total + item.quantity * item.foodItem.price;
    }, 0);

    // Prepare bill details
    const bill = {
      orderNumber: delivery._id,
      restaurantName: delivery.restaurant.name,
      items: delivery.order_items,
      Address: delivery.Address,
      totalAmount,
    };

    res.status(200).json(bill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Process order and finalize delivery
const processOrder = async (req, res) => {
  try {
    const Id = req.params.id;
    const { paymentMode, order_total } = req.body;

    const delivery = await Delivery.findById(Id);
    if (!delivery) {
      return res.status(404).json({ error: "Delivery not found" });
    }

    // Create an order
    const orderData = {
      restaurant: delivery.restaurant,
      order_type: `delivery/pickup`,
      items: delivery.order_items,
      paymentMode,
      orderStatus: "success",
      totalAmount: order_total,
    };

    const order = await Order.create(orderData);

    delivery.orderUpdate = "delivered";
    await delivery.save();

    res.status(200).json({ order, delivery });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addDelivery,
  getDeliveriesByRestaurant,
  getDeliveryDetails,
  updateDelivery,
  getBill,
  processOrder,
};
