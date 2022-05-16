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

// Endpoint to view all the observations made by a teacher
router.get("/v1/teachers/:document/observers", (req, res) => {
  try {
    const sql = `CALL pa_ver_anotaciones_del_docente (${req.params.document})`;
    connection.query(sql, (error, results) => {
      if (error) throw error;
      if (results.length > 0) {
        const token = jwt.sign({ results: results[0] }, tokenSignature);
        return res.status(200).json(token);
      }
    });
  } catch {
    return res.status(500).json({ message: "System Error" });
  }
});

// Endpoint to add a new teacher in the system
router.post("/v4/teachers", uploadImage.single("image"), async (req, res) => {
  try {
    const { document, name, lastName, genre, signature } = await req.body;
    const photo = await cloudinary.uploader.upload(req.file.path);
    const sql = `INSERT INTO docentes(documento,foto,nombre,apellido,genero,firma) VALUES(${document},'${photo.secure_url}','${name}','${lastName}','${genre}','${signature}')`;
    connection.query(sql, (error) => {
      if (error) {
        return res.status(200).json({ registeredTeacher: false });
      }
      return res.status(200).json({ registeredTeacher: true });
    });
  } catch {
    res.status(500).json({ message: "System Error" });
  }
});

module.exports = router;
