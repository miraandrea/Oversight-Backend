//Libraries
const express = require("express");
const jwt = require("jsonwebtoken");

// Initialize
const router = express.Router();

//Routes

// Api to decode the token
router.get("/v1/decode/:token", (req, res) => {
  try {
    const token = req.params.token;
    const tokenDecode = jwt.decode(token);
    res.status(200).json(tokenDecode.results);
  } catch {
    res.status(500).json({ message: "System Error" });
  }
});

module.exports = router;
