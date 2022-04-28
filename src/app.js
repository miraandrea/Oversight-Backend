// Libraries
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

// Initialize
const app = express();

// Apis
const apiStudents = require("./routes/student");
const apiTeachers = require("./routes/teacher");
const apiTokens = require("./routes/token");
const apiCourses = require("./routes/course");
const apiAdministrators = require("./routes/administrator");

// Create a public file and host the images sent through the path
const storage = multer.diskStorage({
  destination: path.join(__dirname, 'public/uploads'),
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + path.extname(file.originalname));
  },
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(apiStudents);
app.use(apiTeachers);
app.use(apiTokens);
app.use(apiCourses);
app.use(apiAdministrators);
app.use(multer({ storage }).single("image"));

module.exports = app;
