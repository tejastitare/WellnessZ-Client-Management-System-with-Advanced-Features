const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const adminController = require("../controllers/adminController");

// Dashboard route, accessible only to admins
router.get("/dashboard", auth(["admin"]), adminController.getDashboardData);

module.exports = router;
