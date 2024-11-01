// routes/clientRoutes.js
const express = require("express");
const auth = require("../middleware/auth");
const { scheduleFollowUp } = require("../controllers/clientController");

const router = express.Router();

// Schedule follow-up session route
router.post("/clients/:id/schedule", auth(["admin", "coach"]), scheduleFollowUp);

module.exports = router;
