const express = require("express");
const router = express.Router();
const Reservation = require("../models/reservation-model");
const User = require("../models/user-model");

// Middleware to protect routes
const ensureAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  res.redirect("/auth/login");
};

// Admin Dashboard Route
router.get("/dashboard", ensureAdmin, (req, res) => {
  res.render("admin-dashboard", { user: req.user });
});

// View all reservations route
router.get("/admin/reservations", ensureAdmin, async (req, res) => {
  try {
    const reservations = await Reservation.find().populate("vehicleId");
    res.render("admin-view-reservations", { reservations });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// View all users route
router.get("/admin/users", ensureAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.render("admin-view-users", { users });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.get("/users", ensureAdmin, async (req, res) => {
  try {
    const users = await User.find(); // target the User model
    res.render("admin-view-users", { users });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Parking lot status route
router.get("/admin/parking-status", ensureAdmin, async (req, res) => {
  try {
    // Example: Count total spots, available spots, and reserved spots
    const totalSpots = 100; // Can be Replaced with actual count if dynamic
    const reservedSpots = await Reservation.countDocuments();
    const availableSpots = totalSpots - reservedSpots;

    res.render("admin-parking-status", {
      totalSpots,
      reservedSpots,
      availableSpots,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Edit user (GET)
router.get("/admin/users/edit/:id", ensureAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.render("admin-edit-user", { user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Edit user (POST)
router.post("/admin/users/edit/:id", ensureAdmin, async (req, res) => {
  try {
    const { name, email, isAdmin } = req.body;
    await User.findByIdAndUpdate(req.params.id, {
      name,
      email,
      isAdmin: isAdmin === "on",
    });
    res.redirect("/admin/users");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Delete user
router.post("/admin/users/delete/:id", ensureAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect("/admin/users");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Add user (GET)
router.get("/admin/users/add", ensureAdmin, (req, res) => {
  res.render("admin-add-user");
});

// Add user (POST)
router.post("/admin/users/add", ensureAdmin, async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;
    const newUser = new User({
      name,
      email,
      password,
      isAdmin: isAdmin === "on",
    });
    await newUser.save();
    res.redirect("/admin/users");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
