// controllers/coachController.js
const User = require("../models/User"); // Assuming you have a User model
const Client = require("../models/Client"); // Assuming you have a Client model
const bcrypt = require("bcrypt"); // To hash passwords
const Joi = require("joi"); // For data validation

// Create a new coach
exports.createCoach = async (req, res) => {
  // Define the schema for validation
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    specialization: Joi.string().optional(),
  });

  // Validate incoming data
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create the new coach
    const coach = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      role: "coach", // Assign the role
      specialization: req.body.specialization,
    });

    // Save the coach to the database
    await coach.save();

    // Respond with success
    res.status(201).json({ message: "Coach created successfully." });
  } catch (error) {
    console.error("Error creating coach:", error);
    res.status(500).json({ message: "Internal Server Error. Could not create coach." });
  }
};

// Get all clients for a coach
exports.getClientsByCoach = async (req, res) => {
  try {
    const { coachId } = req.params;

    // Allow only the coach to access their own clients, while admin can access any coach's clients
    if (req.user.role === "coach" && req.user._id.toString() !== coachId) {
      return res.status(403).json({ message: "Forbidden: You cannot access other coach's clients." });
    }

    const clients = await Client.find({ coachId });

    // Check if clients are found for the given coach
    if (!clients || clients.length === 0) {
      return res.status(404).json({ message: "No clients found for this coach." });
    }

    res.status(200).json({
      message: `Clients for Coach ID: ${coachId}`,
      clients: clients,
    });
  } catch (error) {
    console.error("Error retrieving clients for the coach:", error);
    res.status(500).json({ message: "Internal Server Error. Could not retrieve clients." });
  }
};
