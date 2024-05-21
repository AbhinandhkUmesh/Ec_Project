"use strict";

var addressModel = require('../models/addressmodel');

var orderModel = require('../models/ordermodel');

var userModel = require('../models/usermodel');

var orders = function orders(req, res) {
  var orderID, userId, userEmail, userProfile, order;
  return regeneratorRuntime.async(function orders$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          orderID = req.query.id;
          userId = req.session.userId;
          userEmail = req.session.email;
          _context.next = 6;
          return regeneratorRuntime.awrap(userModel.findOne({
            email: userEmail
          }));

        case 6:
          userProfile = _context.sent;
          _context.next = 9;
          return regeneratorRuntime.awrap(orderModel.find({
            userID: userId
          }));

        case 9:
          order = _context.sent;
          console.log(order);
          res.render('orderPage', {
            isUser: req.session.isUser,
            Username: req.session.Username,
            userProfile: userProfile,
            orders: order // Pass the order details to the template

          });
          _context.next = 18;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](0);
          console.error('Error in OrderConformation:', _context.t0);
          res.status(500).render('error', {
            message: 'An error occurred while loading the order confirmation page.'
          });

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 14]]);
};

module.exports = {
  orders: orders
};