// services/scheduler.js
const cron = require("node-cron");
const Client = require("../models/Client");
const { sendEmail } = require("./emailService");
const moment = require("moment");

// Cron job runs every hour to check for sessions within the next 24 hours
cron.schedule("0 * * * *", async () => {
  console.log("Checking for upcoming sessions...");

  const upcomingSessions = await Client.aggregate([
    { $unwind: "$followUpSessions" },
    {
      $match: {
        "followUpSessions.date": {
          $gte: new Date(),
          $lte: new Date(Date.now() + 24 * 60 * 60 * 1000), // next 24 hours
        },
      },
    },
  ]);

  // Loop through the sessions and send reminders
  upcomingSessions.forEach((session) => {
    const { name, email } = session;
    const { date, time, sessionType } = session.followUpSessions;

    const emailText = `Reminder: Hello ${name}, you have a ${sessionType} scheduled on ${moment(date).format(
      "YYYY-MM-DD"
    )} at ${time}.`;

    sendEmail(email, "Upcoming Follow-Up Session Reminder", emailText);
  });
});
