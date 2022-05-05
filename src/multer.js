// Libraries
const multer = require("multer");
const path = require("path");

// Create a public file and host the images sent through the path
const storage = multer.diskStorage({
  destination: path.join(__dirname, 'public/uploads'),
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + path.extname(file.originalname));
  },
});

const uploadImage = multer({ storage })

module.exports = uploadImage;