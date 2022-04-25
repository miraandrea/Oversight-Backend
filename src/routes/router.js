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
router.get("/", (req, res) => {
  try {
    res.status(200).json({ message: "Api running" });
  } catch {
    res.status(500).json({ message: "System Error" });
  }
});

// Api to validate if a user can authenticate to the system
router.post("/v3/authenticate", (req, res) => {
  try {
    const sql = `SELECT foto,nombre,apellido,fecnac FROM administradores WHERE idadministrador = '${req.body.username}' AND idadministrador = '${req.body.password}'`;
    connection.query(sql, (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        res.status(200).json({
          authentication: true,
          rol: "Administrator",
          data: result,
        });
      } else {
        const sql = `SELECT foto,nombre,apellido,fecnac,sexo,firma FROM docentes WHERE iddocente = '${req.body.username}' AND iddocente = '${req.body.password}'`;
        connection.query(sql, (err, result) => {
          if (err) throw err;
          if (result.length > 0) {
            res.status(200).json({
              authentication: true,
              rol: "Teacher",
              data: result,
            });
          } else {
            const sql = `SELECT foto,nombre,apellido,fecnac,sexo,firma FROM estudiantes WHERE idestudiante = '${req.body.username}' AND idestudiante = '${req.body.password}'`;
            connection.query(sql, (err, result) => {
              if (err) throw err;
              if (result.length > 0) {
                res.status(200).json({
                  authentication: true,
                  rol: "Student",
                  data: result,
                });
              } else {
                res.status(200).json({ authentication: false });
              }
            });
          }
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
        const token = jwt.sign({ result:result[0] }, tokenSignature);
        res.status(200).json(token);
      }
      else{        
        const token = jwt.sign({ existProfessor: false }, tokenSignature);
        res.status(200).json(token);
      }
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

// Api to display all currently created courses
router.get("/v2/courses", (req, res) => {
  try {
    const sql = "CALL pa_todos_los_cursos()";
    connection.query(sql, (error, results) => {
      if (error) throw error;
      if (results.length > 0) {
        res.json(results[0]);
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

// Api to decode the token
router.get("/v1/decode/:token", (req, res) => {
  try {
    const token = req.params.token;
    const tokenDecode = jwt.decode(token);
    res.status(200).json(tokenDecode.results);
  } catch {
    res.status(500).json({ message: "System Error" });
  }
});

// Api to send a "Not Found" message when the user commits a 404 error
router.get("*", (req, res) => {
  res.status(404).json({ message: "Not Found" });
});

module.exports = router;
