const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth"); // Import the authentication middleware
const clientController = require("../controllers/clientController"); // Import the client controller
const validateRequest = require("../middleware/validate"); // Adjust the path if necessary
const { createClientSchema } = require("../validation/clientSchemas"); // Adjust path as needed

// Route to schedule a follow-up session for a client
router.post("/:id/schedule", auth(["coach", "admin"]), clientController.scheduleFollowUp);

// Route to create a new client, accessible to both coaches and admins
router.post("/", auth(["coach", "admin"]), clientController.createClient);

// Route to delete a client, only accessible to admins
router.delete("/:id", auth(["admin"]), clientController.deleteClient);

// Route to update client progress
router.patch("/:id/progress", auth(["coach", "admin"]), clientController.updateClientProgress);

// Create a new client, with validation
router.post("/", auth(["coach", "admin"]), validateRequest(createClientSchema), clientController.createClient);

module.exports = router;
