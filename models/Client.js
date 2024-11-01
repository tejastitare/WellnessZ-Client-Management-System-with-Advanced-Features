// models/Client.js
const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  age: Number,
  goal: String,
  coachId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  progress: [
    {
      progressNotes: String,
      lastUpdated: Date,
      weight: Number,
      bmi: Number,
    },
  ],
});

module.exports = mongoose.model("Client", clientSchema);
