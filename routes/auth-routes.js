// routes/auth-routes.js
const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../models/user-model");

// Register route
router.get("/register", (req, res) => {
  res.render("register", { errors: [] });
});

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  let errors = [];

  // Check required fields
  if (!name || !email || !password) {
    errors.push({ msg: "Please fill in all fields" });
  }

  // Check if password is more than 6 characters
  if (password.length < 6) {
    errors.push({ msg: "Password should be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
    });
  } else {
    // Validation passed
    try {
      let user = await User.findOne({ email: email });
      if (user) {
        // User exists
        errors.push({ msg: "Email is already registered" });
        res.render("register", {
          errors,
          name,
          email,
          password,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });

        // Hash password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            // Set password to hashed
            newUser.password = hash;
            // Save user
            newUser
              .save()
              .then((user) => {
                res.redirect("/auth/login");
              })
              .catch((err) => console.log(err));
          })
        );
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
});

// Login route
router.get("/login", (req, res) => {
  res.render("login", { errors: [] });
});

// Handle login (if using local strategy)
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureFlash: true, // enable flash messages on failure
  })(req, res, next);
});

// Logout route
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/"); // Redirect to the homepage or login page after logout
    });
  });
});

module.exports = router;
