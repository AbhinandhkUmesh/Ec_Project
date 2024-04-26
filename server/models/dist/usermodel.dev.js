"use strict";

var mongoose = require('mongoose');

require("dotenv").config();

mongoose.connect(process.env.MONGODB_ATLAS_CONNECT).then(function () {
  console.log('Monghodb Connected Successfull');
})["catch"](function (error) {
  console.log('Error db not connected', error);
});
var userSchema = new mongoose.Schema({
  Username: {
    type: String,
    required: true
  },
  password: {
    type: String
  },
  image: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  phone: {
    type: Number
  },
  address: {
    type: mongoose.Schema.Types.ObjectId
  },
  status: {
    type: Boolean,
    "default": true,
    require: true
  },
  isAdmin: {
    type: Number,
    "default": 0
  }
});
var userData = new mongoose.model('UserData', userSchema);
module.exports = userData;