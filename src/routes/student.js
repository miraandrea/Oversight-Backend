// Libraries
const express = require("express");
const jwt = require("jsonwebtoken");

// Authentication Token Signature
const tokenSignature = "OAFzGSpmBX9F$agY#$gX4!RnU0Vfgev@mdkO6!1YGwfUzES*^k";

// Initialize Router
const router = express.Router();

// Database
const connection = require("../database");

// Routes

// Api to add a new student in the system
router.post("/v2/students", (req, res) => {
  try {
    const sql = `INSERT INTO estudiantes SET ?`;
    const objStudent = {
      idestudiante: req.body.document,
      foto: req.body.photo,
      nombre: req.body.name,
      apellido: req.body.lastName,
      idcurso: req.body.course,
      fecnac: req.body.dateBirth,
      sexo: req.body.sex,
      firma: req.body.signature,
    };
    connection.query(sql, objStudent, (error) => {
      if (error) throw error;
      res.json({
        registeredStudent: true,
      });
    });
  } catch {
    res.status(500).json({ message: "System Error" });
  }
});

module.exports = router;
