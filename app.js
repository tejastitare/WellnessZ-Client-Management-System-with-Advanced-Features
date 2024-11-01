// app.js
const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();
const app = express();
// Connect to the MongoDB database
connectDB();

// Middleware to parse JSON data
app.use(express.json());

// Define routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/clients", require("./routes/clients"));
app.use("/api/coaches", require("./routes/coaches"));
app.use("/api", require("./routes")); // Ensure `/routes/index.js` is configured correctly
app.use("/api/admin", require("./routes/admin"));

// Initialize the scheduler service
require("./services/scheduler");

// Test email service (Uncomment to test emails)
// const { sendEmail } = require("./services/emailService");
// sendEmail("tejastitare30@gmail.com", "Test Subject", "Test email content.");

// Set up the server to listen on the designated port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
