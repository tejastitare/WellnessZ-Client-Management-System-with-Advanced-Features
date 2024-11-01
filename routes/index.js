// routes/index.js
const express = require("express");
const auth = require("../middleware/auth");
const { createCoach, login } = require("../controllers/userController");

const router = express.Router();

router.post("/login", login);
router.post("/coaches", auth(["admin"]), createCoach);

module.exports = router;
