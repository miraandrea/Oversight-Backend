// Libraries
const express = require("express");

// Initialize Router
const router = express.Router();

// Database
const connection = require("../database");

// Routes
router.get("/", (req, res) => {
  try {
    res.status(200).json({ message: "Api running" });
  } catch {
    res.status(500).json({ message: "System Error" });
  }
});

// Api to validate if a user can authenticate to the system
router.post("/v3/authenticate", (req, res) => {
  try {
    const sql = `SELECT foto,nombre,apellido,fecnac FROM administradores WHERE idadministrador = '${req.body.username}' AND idadministrador = '${req.body.password}'`;
    connection.query(sql, (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        res.status(200).json({
          authentication: true,
          rol: "Administrator",
          data: result,
        });
      } else {
        const sql = `SELECT foto,nombre,apellido,firma FROM docentes WHERE iddocente = '${req.body.username}' AND iddocente = '${req.body.password}'`;
        connection.query(sql, (err, result) => {
          if (err) throw err;
          if (result.length > 0) {
            res.status(200).json({
              authentication: true,
              rol: "Teacher",
              data: result,
            });
          } else {
            const sql = `SELECT foto,nombre,apellido,firma FROM estudiantes WHERE idestudiante = '${req.body.username}' AND idestudiante = '${req.body.password}'`;
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

// Api to validate if a user can authenticate to the system
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

// Api to send a "Not Found" message when the user commits a 404 error
router.get("*", (req, res) => {
  res.status(404).json({ message: "Not Found" });
});

module.exports = router;
