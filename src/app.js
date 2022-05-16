// Libraries
const express = require("express");
const cors = require("cors");


// Initialize
const app = express();

// Apis
const apiRootPage = require('./routes/rootPage');
const apiAuth = require('./routes/auth');
const apiStudents = require("./routes/student");
const apiTeachers = require("./routes/teacher");
const apiTokens = require("./routes/token");
const apiCourses = require("./routes/course");
const apiNotFound = require("./routes/notfound");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(apiRootPage);
app.use(apiAuth);
app.use(apiStudents);
app.use(apiTeachers);
app.use(apiTokens);
app.use(apiCourses);
app.use(apiNotFound);

module.exports = app;
