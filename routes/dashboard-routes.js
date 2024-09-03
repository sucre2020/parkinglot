const express = require("express");
const router = express.Router();

// Middleware to protect the dashboard route
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/login");
};

// Dashboard route
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    user: req.user, // Pass the authenticated user to the view
  });
});

module.exports = router;
