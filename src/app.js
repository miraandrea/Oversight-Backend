// Libraries
const express = require("express");
const cors = require("cors");

// Initialize
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(require('./routes/router'))

module.exports = app;
