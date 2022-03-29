// Libraries
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

// Setting Database
const connection = mysql.createConnection({
  host: "bi3kldvtr4fcfel9zrc9-mysql.services.clever-cloud.com",
  user: "uuxmvtjt9m2ywspo",
  password: "psK7PG8o0BtAoATPcukr",
  database: "bi3kldvtr4fcfel9zrc9",
});

// Initialize
const app = express();

// Port
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "It works",
  });
});

app.post("/api/authenticate", (req, res) => {
  const sql = `SELECT * FROM administradores WHERE idadministrador = '${req.body.username}' AND idadministrador = '${req.body.password}'`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.json({
        authentication: true,
      });
    } else {
      res.json({
        authentication: false,
      });
    }
  });
});

app.post("/api/students", (req, res) => {
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
});

app.post("/api/teachers", (req, res) => {
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
});

//
app.get("/api/courses", (req, res) => {
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
});

// Api to add a new course to the database
app.post("/api/v1/courses", (req, res) => {
  try {
    const { idCourse, name } = req.body;
    const objCourse = {
      idcurso:idCourse,
      nombre:name,
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
// Listener
app.listen(PORT, console.log(`Server running on port ${PORT}`));
