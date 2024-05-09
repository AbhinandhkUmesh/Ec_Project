"use strict";

var Wishlist = require('../models/wishlistmodel'); // Wishlist middleware function


var fetchWishlist = function fetchWishlist(req, res, next) {
  var userId, wishlistProduct;
  return regeneratorRuntime.async(function fetchWishlist$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          // Fetch wishlist data for the logged-in user
          userId = req.session.userId;

          if (userId) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", next());

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(Wishlist.findOne({
            user: userId
          }).populate('product'));

        case 6:
          wishlistProduct = _context.sent;
          res.locals.wishlist = wishlistProduct.product || []; // Attach wishlist data to request object

          next(); // Proceed to next middleware or route handler

          _context.next = 15;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          console.error('Error fetching wishlist:', _context.t0);
          next(_context.t0); // Pass error to error handling middleware

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

module.exports = fetchWishlist;