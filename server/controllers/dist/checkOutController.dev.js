"use strict";

var cartModel = require('../models/cartmodel');

var addressModel = require('../models/addressmodel');

var orderModel = require('../models/ordermodel');

var _require = require('uuid'),
    uuidv4 = _require.v4;

var checkOutPage = function checkOutPage(req, res) {
  var userId, cart, address, add;
  return regeneratorRuntime.async(function checkOutPage$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          userId = req.session.userId;
          _context.next = 4;
          return regeneratorRuntime.awrap(cartModel.findOne({
            userId: userId
          }).populate('items.productId'));

        case 4:
          cart = _context.sent;
          _context.next = 7;
          return regeneratorRuntime.awrap(addressModel.findOne({
            userId: userId
          }));

        case 7:
          address = _context.sent;
          console.log(address);
          add = address.addresses;
          console.log(add);
          res.render('checkOutPage', {
            isUser: req.session.isUser,
            // Assuming req.session.isUser indicates user authentication
            cart: cart,
            addresses: address.addresses
          });
          _context.next = 18;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](0);
          console.error("Error in cartpage:", _context.t0);
          res.render('error'); // Render an error page if there's an error

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 14]]);
}; // Ensure the path to the order model is correct


var OrderConformation = function OrderConformation(req, res) {
  var orderID, order;
  return regeneratorRuntime.async(function OrderConformation$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          orderID = req.query.id; // Fetch the order details using the orderID

          _context2.next = 4;
          return regeneratorRuntime.awrap(orderModel.findOne({
            orderID: orderID
          }));

        case 4:
          order = _context2.sent;

          if (order) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return", res.status(404).render('error', {
            message: 'Order not found.'
          }));

        case 7:
          res.render('OrderConformation', {
            isUser: req.session.isUser,
            order: order // Pass the order details to the template

          });
          _context2.next = 14;
          break;

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](0);
          console.error('Error in OrderConformation:', _context2.t0);
          res.status(500).render('error', {
            message: 'An error occurred while loading the order confirmation page.'
          });

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var placeOrder = function placeOrder(req, res) {
  var userId, _req$body, address, paymentMethod, cart, products, totalOrderValue, newOrder;

  return regeneratorRuntime.async(function placeOrder$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          userId = req.session.userId;
          _req$body = req.body, address = _req$body.address, paymentMethod = _req$body.paymentMethod;
          _context3.next = 5;
          return regeneratorRuntime.awrap(cartModel.findOne({
            userId: userId
          }).populate('items.productId'));

        case 5:
          cart = _context3.sent;

          if (!(!cart || cart.items.length === 0)) {
            _context3.next = 8;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            message: 'Cart is empty.'
          }));

        case 8:
          products = cart.items.map(function (item) {
            return {
              productId: item.productId._id,
              name: item.productId.name,
              quantity: item.quantity,
              price: item.productId.price
            };
          });
          totalOrderValue = cart.cartTotal;
          newOrder = new orderModel({
            userID: userId,
            orderID: uuidv4(),
            user: req.session.userName,
            products: products,
            totalOrderValue: totalOrderValue,
            address: JSON.parse(address),
            date: new Date(),
            status: 'Pending',
            cancel: 'No'
          });
          _context3.next = 13;
          return regeneratorRuntime.awrap(newOrder.save());

        case 13:
          _context3.next = 15;
          return regeneratorRuntime.awrap(cartModel.updateOne({
            userId: userId
          }, {
            $set: {
              items: [],
              cartTotal: 0
            }
          }));

        case 15:
          res.status(200).json({
            orderID: newOrder.orderID
          }); // Send the order ID back to the client

          _context3.next = 22;
          break;

        case 18:
          _context3.prev = 18;
          _context3.t0 = _context3["catch"](0);
          console.error('Error placing order:', _context3.t0);
          res.status(500).json({
            message: 'An error occurred while placing the order. Please try again later.'
          });

        case 22:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 18]]);
};

module.exports = {
  checkOutPage: checkOutPage,
  OrderConformation: OrderConformation,
  placeOrder: placeOrder
};