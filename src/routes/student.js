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

// Api to display a student by name based on the name parameter
router.get("/v1/students/:name", (req, res) => {
  try {
    const sql = `CALL pa_estudiante_por_nombre('${req.params.name}')`;
    connection.query(sql, (error, result) => {
      if (error) throw error;
      if (result.length > 0) {
        const token = jwt.sign({ results: result }, tokenSignature);
        res.status(200).json(token);
      }
    });
  } catch {
    res.status(500).json({ message: "System Error" });
  }
});

// Endpoint to tokenize a student's information by his or her document
router.get("/v2/students/:document", (req, res) => {
  try {
    const sql = `CALL pa_estudiante_por_documento('${req.params.document}')`;
    connection.query(sql, (error, result) => {
      if (error) throw error;
      if (result.length > 0) {
        const token = jwt.sign({ results: result[0] }, tokenSignature);
        return res.status(200).json(token);
      }
    });
  } catch {
    return res.status(404).json({ message: "Student not found" });
  }
});

// Endpoint to modify the information of a specific student.
router.put("/v1/students/:document", uploadImage.single("image"), async (req,res)=>{
  try{
    const { newDocument, name, lastName, genre, signature,idcourse,dateOfBirth } = await req.body;
    const { document } = req.params;
    const photo = await cloudinary.uploader.upload(req.file.path);
    const sql = `CALL pa_editar_estudiante('${newDocument}','${photo.secure_url}','${name}','${lastName}','${idcourse}','${dateOfBirth}','${genre}','${signature}','${document}')`;
    connection.query(sql, (error)=>{
      if(error) throw error;
      const token = jwt.sign({ results: {message:"Student Modificated"} }, tokenSignature);
      return res.status(200).json(token);
    })
  }
  catch{
    return res.status(500).json({ message: "System Error" });
  }
})

// Endpoint to delete a specific student
router.delete("/v1/students/:document",(req,res)=>{
  try{
    const sql = `CALL pa_eliminar_estudiante_por_documento('${req.params.document}')`;
    connection.query(sql,(error)=>{
      if(error){
        return res
          .status(400)
          .json({ results: { message: "Error, Student can't deleted" } });
      }
      const token = jwt.sign({results:{ message: "Student Deleted" }}, tokenSignature);
      return res.status(202).json(token);
    })
  }
  catch(e){
    return res.status(500).json({ message: "System Error" });
  }
})

// Api to visualize all the annotations made to a specific student
router.get("/v1/students/:name/observers", (req, res) => {
  try {
    const sql = `CALL pa_anotaciones_por_nombre('${req.params.name}')`;
    connection.query(sql, (error, results) => {
      if (error) throw error;
      if (results.length > 0) {
        const token = jwt.sign({ results: results[0] }, tokenSignature);
        res.status(200).json(token);
      }
    });
  } catch {
    res.status(500).json({ message: "System Error" });
  }
});

// Api to visualize all the annotations made to a specific student
router.get("/v2/students/:document/observers", (req, res) => {
  try {
    const sql = `CALL pa_anotaciones_por_documento_estudiante('${req.params.document}')`;
    connection.query(sql, (error, results) => {
      if (error) throw error;
      if (results.length > 0) {
        const token = jwt.sign({ results: results[0] }, tokenSignature);
        res.status(200).json(token);
      }
    });
  } catch {
    res.status(500).json({ message: "System Error" });
  }
});

// Endpoint to add a new student in the system
router.post("/v4/students", uploadImage.single("image"), async (req, res) => {
  try {
    const {
      document,
      name,
      lastName,
      idcourse,
      dateOfBirth,
      genre,
      signature,
    } = req.body;
    const result = await cloudinary.uploader.upload(req.file.path);
    const sql = `INSERT INTO estudiantes(documento,foto,nombre,apellido,fecnac,idcurso,genero,firma) VALUES('${document}','${result.secure_url}','${name}','${lastName}','${dateOfBirth}','${idcourse}','${genre}','${signature}')`;
    connection.query(sql, (error) => {
      if (error) {
        return res.status(200).json({ registered: false });
      }
      return res.status(200).json({ registered: true });
    });
  } catch {
    return res.status(500).json({ message: "System Error" });
  }
});

// Endpoint to create a new report to a specific student
router.post("/v1/students/:document/observers", (req, res) => {
  try {
    const { document } = req.params;
    const { title, descriptionStudent,descriptionTeacher, documentTeacher, date, signatureStudent, signatureTeacher } = req.body;
    const sql = `CALL pa_agregar_anotacion_estudiante(${document},'${title}',${documentTeacher},'${date}','${descriptionStudent}','${descriptionTeacher}','${signatureStudent}','${signatureTeacher}')`;
    connection.query(sql, (error) => {
      if (error) throw error;
      const token = jwt.sign(
        { results: { message: true} },
        tokenSignature
      );
      return res.status(200).json(token);
    });
  } catch {
    res.status(500).json({ message: false });
  }
});

module.exports = router;
