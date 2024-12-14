const express = require("express");
const router = express.Router();
const {
  addEmployee,
  getEmployeesByRestaurant,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");
const { verifyToken } = require("../routes/verifyTokens");

// Routes
router.post("/add", verifyToken, addEmployee);
router.get("/restaurant/:id", verifyToken, getEmployeesByRestaurant);
router.get("/restaurant/emp/:id", verifyToken, getEmployeeById);
router.put("/restaurant/:id", verifyToken, updateEmployee);
router.delete("/restaurant/:id", verifyToken, deleteEmployee);

module.exports = router;
