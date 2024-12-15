const Table = require("../models/tableSchema");
const Restaurant = require("../models/restaurantSchema");
const Order = require("../models/orderSchema");
const Kot = require("../models/kotmodel");

// Add a new table
exports.addTable = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.body.restaurant);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    const table = new Table(req.body);
    await table.save();

    restaurant.tables.push(table._id);
    await restaurant.save();

    res.status(200).json(table);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Get all tables for a restaurant
exports.getTablesByRestaurant = async (req, res) => {
  try {
    const tables = await Table.find({ restaurant: req.params.id });
    res.status(200).json(tables);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get table details by ID
exports.getTableById = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id).populate(
      "table_items.foodItem",
      ["name", "price", "category", "code"]
    );
    res.status(200).json(table);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Get KOT by ID
exports.getKotById = async (req, res) => {
  try {
    const kot = await Kot.findById(req.params.id)
      .populate({ path: "restaurant", model: "Restaurant" })
      .populate({ path: "table", model: "Table" });

    if (!kot) {
      return res.status(404).json({ message: "KOT not found" });
    }

    res.json(kot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Update table and create KOT
exports.updateTableAndCreateKot = async (req, res) => {
  try {
    const tableId = req.params.id;
    const { table_items, ...others } = req.body;

    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({ error: "Table not found" });
    }

    const kotData = {
      restaurant: table.restaurant,
      source: `${table.tableType} [${table.tableNumber}]`,
      order_items: table_items,
      status: "pending",
    };

    const kot = await Kot.create(kotData);

    table.table_items = [...table.table_items, ...table_items];
    table.tableVacancy = false;
    await table.save();

    res.status(201).json({ kot, table });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Generate bill for a table
exports.generateTableBill = async (req, res) => {
  try {
    const tableId = req.params.tableId;
    const table = await Table.findById(tableId)
      .populate({
        path: "restaurant",
        model: "Restaurant",
        select: "name",
      })
      .populate({
        path: "table_items.foodItem",
        model: "FoodItem",
        select: "name price",
      });

    if (!table) {
      return res.status(404).json({ error: "Table not found" });
    }

    const totalAmount = table.table_items.reduce((total, item) => {
      return total + item.quantity * item.foodItem.price;
    }, 0);

    const bill = {
      tableNumber: table.tableNumber,
      restaurantName: table.restaurant.name,
      items: table.table_items,
      totalAmount,
    };

    res.status(200).json(bill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Create order and clear table
exports.createOrderAndClearTable = async (req, res) => {
  try {
    const tableId = req.params.tableId;
    const { paymentMode, order_total } = req.body;

    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({ error: "Table not found" });
    }

    const orderData = {
      restaurant: table.restaurant,
      order_type: `${table.tableType} [${table.tableNumber}]`,
      items: table.table_items,
      paymentMode,
      orderStatus: "success",
      totalAmount: order_total,
      table: table._id,
    };

    const order = await Order.create(orderData);

    table.table_items = [];
    table.tableUpdate = "Order Processed";
    table.tableVacancy = true;
    await table.save();

    res.status(200).json({ order, table });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Delete table
exports.deleteTable = async (req, res) => {
  try {
    const tableId = req.params.id;

    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({ error: "Table not found" });
    }

    const restaurantId = table.restaurant;

    await Table.findByIdAndDelete(tableId);

    await Restaurant.findByIdAndUpdate(
      restaurantId,
      { $pull: { tables: tableId } },
      { new: true }
    );

    res.status(200).json({ message: "Table Deleted Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
