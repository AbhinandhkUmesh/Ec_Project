const mongoose = require('mongoose');
const { type } = require('os');



const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserData', // Reference to the User model
    required: true
  },
  product: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'productData' // Reference to the Product model
  }]
});

const wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = wishlist;