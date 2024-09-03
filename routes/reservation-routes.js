const express = require("express");
const router = express.Router();
const Reservation = require("../models/reservation-model");
const Vehicle = require("../models/vehicle-model");

// Middleware to protect routes
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/login");
};

// Make reservation route
router.get("/reservations/new", ensureAuthenticated, async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ userId: req.user.id });
    res.render("make-reservation", { vehicles, errors: [] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.post("/reservations/new", ensureAuthenticated, async (req, res) => {
  const { vehicleId, startTime, endTime } = req.body;
  let errors = [];

  if (!vehicleId || !startTime || !endTime) {
    errors.push({ msg: "Please fill in all fields" });
  }

  if (errors.length > 0) {
    try {
      const vehicles = await Vehicle.find({ userId: req.user.id });
      res.render("make-reservation", { vehicles, errors });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  } else {
    try {
      // Ensure that the reservation is unique by checking for existing reservations
      const existingReservation = await Reservation.findOne({
        userId: req.user.id,
        vehicleId,
        startTime,
        endTime,
      });

      if (existingReservation) {
        errors.push({ msg: "Reservation already exists" });
        const vehicles = await Vehicle.find({ userId: req.user.id });
        return res.render("make-reservation", { vehicles, errors });
      }

      const newReservation = new Reservation({
        userId: req.user.id,
        vehicleId,
        startTime,
        endTime,
      });

      await newReservation.save();
      res.redirect("/reservations");
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
});

// View reservations route
router.get("/reservations", ensureAuthenticated, async (req, res) => {
  try {
    const reservations = await Reservation.find({
      userId: req.user.id,
    }).populate("vehicleId");
    res.render("view-reservations", { reservations });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
