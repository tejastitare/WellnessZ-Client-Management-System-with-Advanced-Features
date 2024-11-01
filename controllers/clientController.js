const { sendEmail } = require("../services/emailService");
const Client = require("../models/Client");
const Joi = require("joi");

// Schema for client validation
const clientSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    age: Joi.number().integer().min(1).required(),
    goal: Joi.string().valid("Weight Loss", "Muscle Gain", "Fitness").required(),
    coachId: Joi.string().required(), // Ensure the coachId is a valid ID format if necessary
});



exports.updateClientProgress = async (req, res) => {
    try {
        const { id } = req.params;
        const { progressNotes, lastUpdated, weight, bmi } = req.body;

        // Find the client by ID
        const client = await Client.findById(id);

        // Check if the client exists
        if (!client) {
            return res.status(404).json({ message: "Client not found." });
        }

        // Check if the requesting user is either an admin or the assigned coach for the client
        if (req.user.role === 'coach' && client.coachId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Forbidden: You cannot update this client's progress." });
        }

        // Update client progress
        // If the client's progress is an array, we need to push the new progress object
        client.progress.push({
            progressNotes,
            lastUpdated,
            weight,
            bmi
        });

        await client.save();
        res.status(200).json({ message: "Client progress updated successfully.", client });
    } catch (error) {
        console.error("Error updating client progress:", error);
        res.status(500).json({ message: "Internal Server Error. Could not update client progress." });
    }
};


// Create a new client
exports.createClient = async (req, res) => {
    console.log("Authenticated User ID:", req.user._id);
    console.log("Request Body Coach ID:", req.body.coachId);
    try {
        const { name, email, phone, age, goal, coachId } = req.body;

        // Ensure coach can only assign clients to themselves
        if (req.user.role === "coach" && req.user._id.toString() !== coachId) {
            console.log("Mismatch Coach ID for Forbidden error");
            return res.status(403).json({ message: "You can only assign clients to yourself." });
        }

        const newClient = new Client({ name, email, phone, age, goal, coachId });
        await newClient.save();
        res.status(201).json(newClient);
    } catch (error) {
        console.error("Error creating client:", error);
        res.status(500).json({ message: "Error creating client." });
    }
};


// Schedule follow-up session
exports.scheduleFollowUp = async (req, res) => {
    const { id } = req.params; // client ID
    const { date, time, sessionType } = req.body;

    // Validate the follow-up session data
    const sessionSchema = Joi.object({
        date: Joi.date().iso().required(),
        time: Joi.string().pattern(/^\d{2}:\d{2}$/).required(), // Enforcing HH:MM time format
        sessionType: Joi.string().valid("Consultation", "Follow-up").required(),
    });

    const { error } = sessionSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const client = await Client.findById(id);
        if (!client) return res.status(404).json({ message: "Client not found" });

        // Create the follow-up session and save it to the client's record
        const session = { date, time, sessionType };
        client.followUpSessions = client.followUpSessions || [];
        client.followUpSessions.push(session);
        await client.save();

        // Send an email notification to the client
        const emailText = `Hello ${client.name}, you have a ${sessionType} scheduled on ${date} at ${time}.`;
        await sendEmail(client.email, "New Follow-Up Session Scheduled", emailText);

        res.status(200).json({ message: "Follow-up session scheduled and email sent." });
    } catch (error) {
        console.error("Error scheduling follow-up session:", error); // Improved logging
        res.status(500).json({ message: "Error scheduling follow-up session." });
    }
};

// Delete a client
exports.deleteClient = async (req, res) => {
    const { id } = req.params; // client ID

    try {
        const client = await Client.findById(id);
        if (!client) return res.status(404).json({ message: "Client not found" });

        // Delete the client from the database
        await client.remove();

        // Optionally, you can also send a notification email about the deletion
        // const emailText = `Hello, your account has been deleted.`;
        // sendEmail(client.email, "Account Deletion Notification", emailText);

        res.status(200).json({ message: "Client deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting client." });
    }
};
