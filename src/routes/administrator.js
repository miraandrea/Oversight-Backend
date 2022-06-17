// Libraries
const express = require("express");
const jwt = require("jsonwebtoken");

// Modules exports
const uploadImage = require("../multer");
const cloudinary = require("../cloudinary");

// Authentication Token Signature
const tokenSignature = "OAFzGSpmBX9F$agY#$gX4!RnU0Vfgev@mdkO6!1YGwfUzES*^k";

// Initializing
const router = express.Router();

// Database
const connection = require("../database");

// Endpoint to display all administrators
router.get("/v1/administrators", (req, res) => {
  try {
    const sql = `CALL pa_administradores`;
    connection.query(sql, (error, results) => {
      if (error) throw error;
      if (results.length > 0) {
        const token = jwt.sign({ results: results[0] }, tokenSignature);
        return res.status(200).json(token);
      }
      const token = jwt.sign(
        { results: { message: "There are no administrators" } },
        tokenSignature
      );
      return res.status(404).json(token);
    });
  } catch {
    return res.status(500).json({ message: "System Error" });
  }
});

// Endpoint to deploy an administrator by means of the document
router.get("/v1/administrators/:document", (req, res) => {
  try {
    const { document } = req.params;
    const sql = `CALL pa_administrador_por_documento('${document}')`;
    connection.query(sql, (error, results) => {
      if (error) throw error;
      if (results.length > 0) {
        const token = jwt.sign({ results: results[0] }, tokenSignature);
        return res.status(200).json(token);
      }
      const token = jwt.sign(
        { results: { message: "Administrator not found" } },
        tokenSignature
      );
      return res.status(404).json(token);
    });
  } catch {
    return res.status(500).json({ message: "System Error" });
  }
});

// Endpoint to modify the information of a specific administrator 
router.put("/v1/administrators/:document",uploadImage.single("image"), async(req,res)=>{
  try{
    const {document,name,lastName} = req.body;
    const photo = await cloudinary.uploader.upload(req.file.path);
    const sql = `CALL pa_editar_administrador('${req.params.document}','${photo.secure_url}','${name}','${lastName}','${document}')`;
    connection.query(sql, (error) => {
      if (error) throw error;
      return res.status(200).json({ message: "Administrator Modificated" });
    });
  }
  catch(e){
    console.log(e);
    return res.status(500).json({ message: "System Error" });
  }
})

module.exports = router;
