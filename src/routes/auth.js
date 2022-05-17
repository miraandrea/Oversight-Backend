// Libraries
const express = require("express");

// Initializing
const router = express.Router();

// database
connection = require('../database');

// Endpoint to validate if a user can authenticate to the system
router.post("/v4/authenticate", (req, res) => {
  try {
    const sql = `SELECT foto,nombre,apellido FROM administradores WHERE documento = '${req.body.username}' AND documento = '${req.body.password}'`;
    connection.query(sql, (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        res.status(200).json({
          authentication: true,
          rol: "Administrator",
          data: result,
        });
      } else {
        const sql = `SELECT foto,nombre,apellido,firma FROM docentes WHERE documento = '${req.body.username}' AND documento = '${req.body.password}'`;
        connection.query(sql, (err, result) => {
          if (err) throw err;
          if (result.length > 0) {
            res.status(200).json({
              authentication: true,
              rol: "Teacher",
              data: result,
            });
          } else {
            const sql = `SELECT foto,nombre,apellido,firma FROM estudiantes WHERE documento = '${req.body.username}' AND documento = '${req.body.password}'`;
            connection.query(sql, (err, result) => {
              if (err) throw err;
              if (result.length > 0) {
                res.status(200).json({
                  authentication: true,
                  rol: "Student",
                  data: result,
                });
              } else {
                res.status(200).json({ authentication: false });
              }
            });
          }
        });
      }
    });
  } catch {
    res.status(500).json({ message: "System Error" });
  }
});

module.exports = router;