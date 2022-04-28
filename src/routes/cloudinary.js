// Librarie
const cloudinary = require("cloudinary");

// Setting
cloudinary.v2.config({
  api_key: "kleverman",
  api_secret: "465886557351196",
  cloud_name: "LUPUoGsvQN4gwpFy_ETEeUjcRZo",
});

module.exports = cloudinary;
