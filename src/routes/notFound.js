// Libraries
const express = require("express");

// Initializing
const router = express.Router();

// Endpoint to display an error message for accessing the root endpoint
router.get("*", (req, res) => {
  return res.status(404).json({ message: "Page not Found" });
});

module.exports = router;
