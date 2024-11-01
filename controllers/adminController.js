const Client = require("../models/Client");
const User = require("../models/User");
const mongoose = require("mongoose");
const NodeCache = require("node-cache");

// Create a cache instance to store dashboard data for 5 minutes
const cache = new NodeCache({ stdTTL: 300 });

exports.getDashboardData = async (req, res) => {
  try {
    // Check if data is cached
    const cachedData = cache.get("dashboardData");
    if (cachedData) return res.status(200).json(cachedData);

    // Total number of clients
    const totalClients = await Client.countDocuments();

    // Number of active clients (clients with at least one session scheduled in the future)
    const activeClients = await Client.countDocuments({
      "followUpSessions.date": { $gte: new Date() }
    });

    // Number of coaches and average clients per coach
    const totalCoaches = await User.countDocuments({ role: "coach" });
    const averageClientsPerCoach = totalClients / (totalCoaches || 1);

    // Clients' progress trends (average weight loss/gain over time)
    const progressTrends = await Client.aggregate([
      { $unwind: "$progress" },
      {
        $group: {
          _id: null,
          averageWeight: { $avg: "$progress.weight" },
          averageBMI: { $avg: "$progress.bmi" }
        }
      }
    ]);

    const data = {
      totalClients,
      activeClients,
      totalCoaches,
      averageClientsPerCoach,
      progressTrends: progressTrends[0] || { averageWeight: 0, averageBMI: 0 }
    };

    // Cache the data
    cache.set("dashboardData", data);

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
};
