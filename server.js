// server.js
const express = require("express");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const flash = require("connect-flash"); // Import connect-flash
require("dotenv/config");
// Route handlers
const authRoutes = require("./routes/auth-routes");
const dashboardRoutes = require("./routes/dashboard-routes");
const vehicleRoutes = require("./routes/vehicle-routes");
const reservationRoutes = require("./routes/reservation-routes");
const transactionRoutes = require("./routes/transaction-routes");
const adminRoutes = require("./routes/admin-routes");

// Initialize app
const app = express();

// Passport configuration
require("./config/passport");

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Set static files directory
app.use(express.static("public"));

// Session middleware
app.use(
  session({
    secret: process.env.cookieKey,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Flash middleware
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use routes
app.use("/auth", authRoutes);
app.use("/", dashboardRoutes);
app.use("/", vehicleRoutes);
app.use("/", reservationRoutes);
app.use("/", transactionRoutes);
app.use("/", adminRoutes);
app.use("/admin", adminRoutes);

// Home route
app.get("/", (req, res) => {
  res.render("home", { user: req.user });
});

// Connect to MongoDB
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.yoczwia.mongodb.net/parking?retryWrites=true&w=majority&appName=Cluster0`;

mongoose
  .connect(uri, {})
  .then(() => {
    console.log("Connected to MongoDB Successfully!");
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
