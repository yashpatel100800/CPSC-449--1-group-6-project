const express = require("express");
const router = express.Router();
const {
  addTable,
  getTablesByRestaurant,
  getTableById,
  getKotById,
  updateTableAndCreateKot,
  generateTableBill,
  createOrderAndClearTable,
  deleteTable,
} = require("../controllers/tableController");

const { verifyToken, verifyTokenAndAuthorization } = require("./verifyTokens");

router.post("/add", verifyToken, addTable);
router.get(
  "/restaurant/:id",
  verifyTokenAndAuthorization,
  getTablesByRestaurant
);
router.get("/table/:id", verifyToken, getTableById);
router.get("/kots/:id", verifyToken, getKotById);
router.put("/update/:id", verifyToken, updateTableAndCreateKot);
router.get("/bill/:tableId", verifyToken, generateTableBill);
router.put("/order/:tableId", verifyToken, createOrderAndClearTable);
router.delete("/delete/:id", verifyToken, deleteTable);

module.exports = router;
