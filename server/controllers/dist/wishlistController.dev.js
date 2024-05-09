"use strict";

// Import necessary modules
var Wishlist = require('../models/wishlistmodel');

var Product = require('../models/productmodel');

var ObjectId = require('mongoose').Types.ObjectId; // Add product to wishlist


var addToWishlist = function addToWishlist(req, res) {
  var userId, productId, userIdObj, productIdObj, wishlist;
  return regeneratorRuntime.async(function addToWishlist$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          userId = req.session.userId; // Assuming user ID is stored in session

          productId = req.params.productId;

          if (!(!userId || !productId)) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: 'Invalid request'
          }));

        case 5:
          // Convert userId and productId to ObjectId
          userIdObj = new ObjectId(userId);
          productIdObj = new ObjectId(productId); // Update product's wishlist field to true

          _context.next = 9;
          return regeneratorRuntime.awrap(Product.updateOne({
            _id: productIdObj
          }, {
            wishlist: true
          }));

        case 9:
          _context.next = 11;
          return regeneratorRuntime.awrap(Wishlist.updateOne({
            user: userIdObj
          }, {
            $addToSet: {
              product: productIdObj
            }
          }, {
            upsert: true
          }));

        case 11:
          wishlist = _context.sent;
          console.log("Wishlist update result:", wishlist);
          res.json({
            success: true
          });
          _context.next = 20;
          break;

        case 16:
          _context.prev = 16;
          _context.t0 = _context["catch"](0);
          console.error('Error adding product to wishlist:', _context.t0);
          res.status(500).json({
            error: 'Server error'
          });

        case 20:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 16]]);
}; // Remove product from wishlist


var removeFromWishlist = function removeFromWishlist(req, res) {
  var userId, productId, userIdObj, productIdObj, wishlist;
  return regeneratorRuntime.async(function removeFromWishlist$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          userId = req.session.userId; // Assuming user ID is stored in session

          productId = req.params.productId;

          if (!(!userId || !productId)) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            error: 'Invalid request'
          }));

        case 5:
          // Convert userId to ObjectId
          userIdObj = new ObjectId(userId);
          productIdObj = new ObjectId(productId); // Update product's wishlist field to false

          _context2.next = 9;
          return regeneratorRuntime.awrap(Product.updateOne({
            _id: productIdObj
          }, {
            wishlist: false
          }));

        case 9:
          _context2.next = 11;
          return regeneratorRuntime.awrap(Wishlist.updateOne({
            user: userIdObj
          }, {
            $pull: {
              product: productIdObj
            }
          }));

        case 11:
          wishlist = _context2.sent;
          console.log("Wishlist remove result:", wishlist);
          res.json({
            success: true
          });
          _context2.next = 20;
          break;

        case 16:
          _context2.prev = 16;
          _context2.t0 = _context2["catch"](0);
          console.error('Error removing product from wishlist:', _context2.t0);
          res.status(500).json({
            error: 'Server error'
          });

        case 20:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 16]]);
};

module.exports = {
  addToWishlist: addToWishlist,
  removeFromWishlist: removeFromWishlist
};