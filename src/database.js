// Librarie
const mysql = require("mysql");

// Setting Database
const connection = mysql.createConnection({
  host: "bkgvbyjg6gvfvqxp9kar-mysql.services.clever-cloud.com",
  user: "uqctkzub7naiojey",
  password: "NnmcQ2MTW5yhs2gEdtkW",
  database: "bkgvbyjg6gvfvqxp9kar",
  port:'3306'
});

module.exports = connection;
