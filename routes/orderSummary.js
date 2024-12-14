const express = require("express");
const router = express.Router();
const OrderSummary = require("../models/orderSummarySchema");
router.get("/restaurant/:id",async (req, res) => {
    try {  
      // Fetch the latest order summary for the specified restaurant
      const orderSummary = await OrderSummary.find({ restaurant: req.params.id})
        .sort({ date: -1 })
        .exec();
  
      if (!orderSummary) {
        return res.status(404).json({ error: 'Order summary not found for the specified restaurant' });
      }
  
      res.status(200).json(orderSummary);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })
module.exports = router;