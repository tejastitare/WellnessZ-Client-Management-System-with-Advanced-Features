// routes/coaches.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const coachController = require("../controllers/coachController");

// Only admin can create a new coach
router.post("/", auth(["admin"]), coachController.createCoach);

// Both admins and coaches can view clients assigned to a specific coach
// Coaches can only view their own clients, admins can view any coach's clients
router.get("/:coachId/clients", auth(["admin", "coach"]), coachController.getClientsByCoach);

module.exports = router;
