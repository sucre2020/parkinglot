const express = require("express");
const router = express.Router();
const Vehicle = require("../models/vehicle-model");

// Middleware to protect routes
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/login");
};

// Add vehicle route
router.get("/vehicles/add", ensureAuthenticated, (req, res) => {
  res.render("add-vehicle", { errors: [], user: req.user });
});

router.post("/vehicles/add", ensureAuthenticated, async (req, res) => {
  const { licensePlate, make, model, year } = req.body;
  let errors = [];

  if (!licensePlate) {
    errors.push({ msg: "Please enter a license plate" });
  }

  if (errors.length > 0) {
    res.render("add-vehicle", { errors, user: req.user });
  } else {
    try {
      const newVehicle = new Vehicle({
        userId: req.user.id,
        licensePlate,
        make,
        model,
        year,
      });

      await newVehicle.save();
      res.redirect("/vehicles");
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
});

// View vehicles route
router.get("/vehicles", ensureAuthenticated, async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ userId: req.user.id });
    res.render("view-vehicles", { vehicles, user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
