"use strict";

var multer = require("multer");

var path = require('path'); // Multer setup for handling file uploads


var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, 'uploads/admin/upload/'); // Set your destination folder
  },
  filename: function filename(req, file, cb) {
    var timestamp = new Date().getTime();
    cb(null, timestamp + '-' + path.extname(file.originalname));
  }
});
var upload = multer({
  storage: storage
});
module.exports = upload;