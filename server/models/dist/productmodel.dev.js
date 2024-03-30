"use strict";

var mongoose = require('mongoose');

var product = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  rate: {
    type: Number,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  stock: {
    type: Number,
    required: true,
    trim: true
  },
  image: {
    type: Array,
    required: true,
    trim: true
  },
  hide: {
    type: Boolean,
    "default": false // Provide a default value

  },
  offer: {
    type: Number
  },
  discountAmount: {
    type: Number
  },
  catOffer: {
    type: Number
  }
});
var productData = new mongoose.model('productData', product);
module.exports = productData;