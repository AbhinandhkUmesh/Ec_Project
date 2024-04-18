"use strict";

var mongoose = require('mongoose');

var categorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  list: {
    type: Number,
    required: true
  },
  offer: {
    type: Number
  },
  status: {
    type: Boolean,
    "default": true,
    require: true
  }
});
var category = new mongoose.model('category', categorySchema);
module.exports = category;