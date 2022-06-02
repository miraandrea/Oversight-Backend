// Libraries
const express = require("express");
const jwt = require("jsonwebtoken");

// Modules exports
const uploadImage = require("../multer");
const cloudinary = require("../cloudinary");

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

// Api to display all currently created courses
router.get("/v4/courses", (req, res) => {
  try {
    const sql = "CALL pa_todos_los_cursos()";
    connection.query(sql, (error, results) => {
      if (error) throw error;
      if (results.length > 0) {
        const token = jwt.sign({ results: results[0] }, tokenSignature);
        return res.status(200).json(token);
      }
      const token = jwt.sign({ results: { message: "No courses available" } });
      return res.status(200).json(token);
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
router.post("/v5/courses", uploadImage.single("image"), async (req, res) => {
  try {
    const { name, documentTeacher } = await req.body;
    const result = await cloudinary.uploader.upload(req.file.path);
    const sql = `INSERT INTO cursos(nombre,foto,documentoDocente) VALUES('${name}','${result.secure_url}',${documentTeacher})`;
    connection.query(sql, (error) => {
      if (error) throw error;
      res.status(200).json({ courseRegistered: true });
    });
  } catch {
    res.status(400).json({ courseRegistered: false });
  }
});

module.exports = router;
