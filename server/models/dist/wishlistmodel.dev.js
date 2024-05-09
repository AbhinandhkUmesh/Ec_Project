"use strict";

var mongoose = require('mongoose');

var _require = require('os'),
    type = _require.type;

var wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserData',
    // Reference to the User model
    required: true
  },
  product: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'productData' // Reference to the Product model

  }]
});
var wishlist = mongoose.model('Wishlist', wishlistSchema);
module.exports = wishlist;