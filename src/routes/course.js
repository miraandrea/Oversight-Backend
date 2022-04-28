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

// Api to display all currently created courses
router.get("/v3/courses", (req, res) => {
  try {
    const sql = "CALL pa_todos_los_cursos()";
    connection.query(sql, (error, results) => {
      if (error) throw error;
      if (results.length > 0) {
        const token = jwt.sign({ results }, tokenSignature);
        res.status(200).json(token);
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

// Api to display all students of the corresponding course
router.get("/v1/courses/:name", (req, res) => {
  try {
    const sql = `CALL pa_estudiantes_por_curso('${req.params.name}')`;
    connection.query(sql, (error, results) => {
      if (error) throw error;
      if (results.length > 0) {
        res.status(200).json(results[0]);
      }
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

// Api to add a new course to the database
router.post("/v2/courses", async (req, res) => {
  try {
    const { idCourse, name } = await req.body;
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    const objCourse = {
      idcurso: idCourse,
      nombre: name,
      foto: result.url,
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

// Api to add a new course to the database
router.post("/v3/courses", async (req, res) => {
  try {
    const { name } = await req.body;
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    const objCourse = {
      nombre: name,
      foto: result.url,
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

module.exports = router;
