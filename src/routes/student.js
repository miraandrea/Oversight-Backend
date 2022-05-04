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

// Api to display a student by name based on the name parameter
router.get("/v1/students/:name", (req, res) => {
  try {
    const sql = `CALL pa_estudiante_por_nombre('${req.params.name}')`;
    connection.query(sql,(error,result)=>{
      if(error) throw error;
      if(result.length > 0){
        const token = jwt.sign({results:result},tokenSignature)
        res.status(200).json(token);
      }
    })
  } catch {
    res.status(500).json({ message: "System Error" });
  }
});

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
