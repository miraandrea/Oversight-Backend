// Librarie
const cloudinary = require("cloudinary").v2;

// Setting
cloudinary.config({
  api_secret: "LUPUoGsvQN4gwpFy_ETEeUjcRZo",
  api_key: "465886557351196",
  cloud_name: "kleverman",
});

module.exports = cloudinary;