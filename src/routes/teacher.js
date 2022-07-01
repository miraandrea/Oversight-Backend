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

// Endpoint to visualize all disabled teachers
router.get('/v1/disabled/teachers',(req,res)=>{
  try{
    const sql = `CALL pa_docente_deshabilitado()`;
    connection.query(sql,(error,results)=>{
      if(error) return res.status(400).json({message:"Upsss, Error"});
      if(results.length>0){
        const token = jwt.sign({results:results[0]},tokenSignature)
        return res.status(200).json(token);
      }
      const token = jwt.sign({ results: "Teachers not found" }, tokenSignature);
      return res.status(200).json(token);
    })
  }
  catch{
    return res.status(500).json({ message: "System Error" });
  }
});

// Endpoint to enable teachers
router.put('/v1/disabled/teachers/:document/enable',(req,res)=>{
  try{
    const sql = `CALL pa_habilitar_docente('${req.params.document}')`;
    connection.query(sql,(error)=>{
      if (error)
        return res.status(400).json({ results: { message: "Upsss, Error" } });
      const token = jwt.sign({ results: {results:"Teacher enable"} }, tokenSignature);
      return res.status(200).json(token);
    })
  }
  catch{
    return res.status(500).json({ message: "System Error" });
  }
});

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

// Endpoint to display a specific teacher according to their document
router.get("/v1/teachers/:document", (req, res) => {
  try {
    const sql = `CALL pa_docente_por_documento(${req.params.document})`;
    connection.query(sql, (error, result) => {
      if (error) throw error;
      if (result.length > 0) {
        const token = jwt.sign({ results: result[0] }, tokenSignature);
        return res.status(200).json(token);
      }
      return res.status(404).json({ message: "Teacher not found" });
    });
  } catch {
    return res.status(500).json({ message: "System Error" });
  }
});

// Endpoint to modify a specific teacher's information
router.put("/v1/teachers/:document", uploadImage.single("image"), async (req,res)=>{
  try{
    const { newDocument, name, lastName, genre, signature, idasignature } = await req.body;
    const { document } = req.params;
    const photo = await cloudinary.uploader.upload(req.file.path);
    const sql = `CALL pa_editar_docente('${document}','${photo.secure_url}','${name}','${lastName}','${idasignature}','${genre}','${signature}','${newDocument}')`;
    connection.query(sql, (error)=>{
      if(error) throw error;
      const token = jwt.sign({ results: {message:"Teacher Modificated"} }, tokenSignature);
      return res.status(200).json(token);
    })
  }
  catch{
    return res.status(500).json({ message: "System Error" });
  }
})

// Endpoint to delete specific teacher
router.delete('/v1/teachers/:document',(req,res)=>{
  try {
    const sql = `CALL pa_eliminar_docente_por_documento(${req.params.document})`;
    connection.query(sql, (error) => {
      if (error)
        return res.status(400).json({ message: "Error, teacher not deleted" });
      return res.status(202).json({ message: "Teacher deleted" });
    });
  } catch {
    return res.status(500).json({ message: "System Error" });
  }
})

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

// Endpoint to display all courses available to a single teacher
router.get("/v1/teachers/:document/courses", (req, res) => {
  try {
    const sql = `CALL pa_director_grupo (${req.params.document})`;
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
    const { document, name, lastName, genre, signature, active } = await req.body;
    const photo = await cloudinary.uploader.upload(req.file.path);
    const sql = `INSERT INTO docentes(documento,foto,nombre,apellido,genero,firma,activo) VALUES(${document},'${photo.secure_url}','${name}','${lastName}','${genre}','${signature}',${active})`;
    connection.query(sql, (error) => {
      if (error) {
        return res.status(200).json({ registered: false });
      }
      return res.status(200).json({ registered: true });
    });
  } catch {
    res.status(500).json({ message: "System Error" });
  }
});

// Api to display a teacher by name based on the name parameter
router.get("/v1/teacher/:name", (req, res) => {
  try {
    const sql = `CALL pa_buscador_docente('${req.params.name}')`;
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

module.exports = router;