const express = require("express");
const router = express.Router();
const {
  getAllKots,
  getKotById,
  updateKot,
  deleteKot,
} = require("../controllers/kotController");
const { verifyToken, verifyTokenAndAuthorization } = require("../routes/verifyTokens");

// Routes
router.get("/restaurant/:id", verifyTokenAndAuthorization, getAllKots);
router.get("/kots/:id", verifyToken, getKotById);
router.put("/kots/:id", verifyTokenAndAuthorization, updateKot);
router.delete("/kots/:id", verifyTokenAndAuthorization, deleteKot);

module.exports = router;
