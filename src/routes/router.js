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
router.post("/v1/authenticate", (req, res) => {
  try {
    const sql = `SELECT * FROM administradores WHERE idadministrador = '${req.body.username}' AND idadministrador = '${req.body.password}'`;
    connection.query(sql, (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        res.status(200).json({
          authentication: true,
        });
      } else {
        res.status(200).json({
          authentication: false,
        });
      }
    });
  } catch {
    res.status(500).json({ message: "System Error" });
  }
});

// Api to add a new student in the system
router.post("/v1/students", (req, res) => {
  try {
    const sql = `INSERT INTO estudiantes SET ?`;
    const objStudent = {
      idestudiante: req.body.document,
      foto: req.body.photo,
      nombre: req.body.studentName,
      apellido: req.body.studentLastName,
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

// Api to add a new teacher in the system
router.post("/v1/teachers", (req, res) => {
  try {
    const sql = `INSERT INTO docentes SET ?`;
    const objTeacher = {
      iddocente: req.body.document,
      foto: req.body.photo,
      nombre: req.body.teacherName,
      apellido: req.body.teacherLastName,
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

// Api to add a new course to the database
router.post("/v1/courses", (req, res) => {
  try {
    const { idCourse, name } = req.body;
    const objCourse = {
      idcurso: idCourse,
      nombre: name,
    };
    const sql = "INSERT INTO cursos SET ?";
    connection.query(sql, objCourse, (error) => {
      if (error) throw error;
      res.status(200).json({ courseRegistered: true });
    });
  } catch {
    res.status(500).json({ message: "System Error" });
  }
});

// Api to display all currently created courses
router.get("/v1/courses", (req, res) => {
  try {
    const sql = "SELECT * FROM cursos";
    connection.query(sql, (error, results) => {
      if (error) throw error;
      if (results.length > 0) {
        res.json(results);
      } else {
        res.json({
          message: "Not found courses",
        });
      }
    });
  } catch {
    res.status(500).json({ message: "System Error" });
  }
});

module.exports = router;
