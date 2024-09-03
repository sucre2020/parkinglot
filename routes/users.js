const express = require("express");
const router = express.Router();
const User = require("../models/user-model");

//get all users from the db
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
