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

// Api to display all currently created teachers
router.get("/v1/teachers", (req, res) => {
  try {
    const sql = `CALL pa_todos_los_docentes`;
    connection.query(sql, (error, results) => {
      if (error) throw error;
      if (results.length > 0) {
        const token = jwt.sign({ results }, tokenSignature);
        res.status(200).json(token);
      } else {
        const token = jwt.sign({ existProfessors: false }, tokenSignature);
        res.status(200).json(token);
      }
    });
  } catch {
    res.status(500).json({ message: "System Error" });
  }
});

// Api to display a specific teacher according to their name
router.get("/v1/teachers/:name", (req, res) => {
  try {
    const sql = `CALL pa_docente_por_nombre('${req.params.name}')`;
    connection.query(sql, (error, result) => {
      if (error) throw error;
      if (result.length > 0) {
        console.log(result[0]);
        const token = jwt.sign({ result: result[0] }, tokenSignature);
        res.status(200).json(token);
      } else {
        const token = jwt.sign({ existProfessor: false }, tokenSignature);
        res.status(200).json(token);
      }
    });
  } catch {
    res.status(500).json({ message: "System Error" });
  }
});

// Api to add a new teacher in the system
router.post("/v2/teachers", (req, res) => {
  try {
    const sql = `INSERT INTO docentes SET ?`;
    const objTeacher = {
      iddocente: req.body.document,
      foto: req.body.photo,
      nombre: req.body.name,
      apellido: req.body.lastName,
      idasignatura: req.body.subject,
      fecnac: req.body.dateBirth,
      sexo: req.body.sex,
      firma: req.body.signature,
    };
    connection.query(sql, objTeacher, (error) => {
      if (error) throw error;
      res.json({
        registeredTeacher: true,
      });
    });
  } catch {
    res.status(500).json({ message: "System Error" });
  }
});

module.exports = router;
