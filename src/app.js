// Libraries
const express = require("express");
const cors = require("cors");


// Initialize
const app = express();

// Apis
const apiStudents = require("./routes/student");
const apiTeachers = require("./routes/teacher");
const apiTokens = require("./routes/token");
const apiCourses = require("./routes/course");
const apiAdministrators = require("./routes/administrator");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(apiStudents);
app.use(apiTeachers);
app.use(apiTokens);
app.use(apiCourses);
app.use(apiAdministrators);

module.exports = app;
