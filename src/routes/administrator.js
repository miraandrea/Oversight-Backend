// Libraries
const express = require("express");
const jwt = require("jsonwebtoken");

// Authentication Token Signature
const tokenSignature = "OAFzGSpmBX9F$agY#$gX4!RnU0Vfgev@mdkO6!1YGwfUzES*^k";

// Initializing
const router = express.Router();

// Database
connection = require("../database");

// Endpoint to display all administrators
router.get("/v1/administrators", (req, res) => {
  try {
    const sql = `CALL pa_administradores`;
    connection.query(sql, (error, results) => {
      if (error) throw error;
      if (results.length > 0) {
        const token = jwt.sign({ results: results[0] }, tokenSignature);
        return res.status(200).json(token);
      }
      const token = jwt.sign(
        { results: { message: "There are no administrators" } },
        tokenSignature
      );
      return res.status(404).json(token);
    });
  } catch {
    return res.status(500).json({ message: "System Error" });
  }
});

// Endpoint to deploy an administrator by means of the document
router.get("/v1/administrators/:document", (req, res) => {
  try {
    const { document } = req.params;
    const sql = `CALL pa_administrador_por_documento('${document}')`;
    connection.query(sql, (error, results) => {
      if (error) throw error;
      if (results.length > 0) {
        const token = jwt.sign({ results: results[0] }, tokenSignature);
        return res.status(200).json(token);
      }
      const token = jwt.sign(
        { results: { message: "Administrator not found" } },
        tokenSignature
      );
      return res.status(404).json(token);
    });
  } catch {
    return res.status(500).json({ message: "System Error" });
  }
});

module.exports = router;
