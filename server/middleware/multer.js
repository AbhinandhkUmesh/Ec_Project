const multer = require("multer");
const path = require('path');

// Multer setup for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/admin/upload/') // Set your destination folder
    },
    filename: function (req, file, cb) {
        const timestamp = new Date().getTime();
        cb(null, timestamp + '-' + path.extname(file.originalname))
    }
});
const upload = multer({ storage: storage });

module.exports = upload;