// routes/auth.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js");

// Register route
router.post("/register", authController.register);

// Login route (optional for JWT login testing)
router.post("/login", authController.login);

module.exports = router;
