// Libraries
const express = require("express");

// Initializing
const router = express.Router();

// Endpoint to display a welcome message for accessing the root endpoint
router.get("/", (req, res) => {
  try {
    res.status(200).json({ message: "Welcome to the oversight api" });
  } catch {
    res.status(500).json({ message: "System Error" });
  }
});

module.exports = router;