const express = require("express");
const router = express.Router();
const Transaction = require("../models/transaction-model");

// Middleware to protect routes
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/login");
};

// View transaction history route
router.get("/transactions", ensureAuthenticated, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({
      date: -1,
    });
    res.render("view-transactions", { transactions, messages: req.flash() });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
