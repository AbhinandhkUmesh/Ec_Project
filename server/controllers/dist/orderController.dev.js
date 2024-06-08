"use strict";

var orderModel = require('../models/ordermodel');

var userModel = require('../models/usermodel');

var ProductModel = require('../models/productmodel');

var orders = function orders(req, res) {
  var userId, userEmail, userProfile, page, limit, skip, totalOrders, totalPages, orderList;
  return regeneratorRuntime.async(function orders$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          userId = req.session.userId;
          userEmail = req.session.email;
          _context.next = 5;
          return regeneratorRuntime.awrap(userModel.findOne({
            email: userEmail
          }));

        case 5:
          userProfile = _context.sent;
          page = parseInt(req.query.page) || 1; // Current page number, default to 1

          limit = 5; // Number of orders per page

          skip = (page - 1) * limit; // Number of orders to skip

          _context.next = 11;
          return regeneratorRuntime.awrap(orderModel.countDocuments({
            userID: userId
          }));

        case 11:
          totalOrders = _context.sent;
          totalPages = Math.ceil(totalOrders / limit);
          _context.next = 15;
          return regeneratorRuntime.awrap(orderModel.find({
            userID: userId
          }).sort({
            date: -1
          }).skip(skip).limit(limit));

        case 15:
          orderList = _context.sent;
          res.render('orderPage', {
            isUser: req.session.isUser,
            Username: req.session.Username,
            userProfile: userProfile,
            orders: orderList,
            totalPages: totalPages,
            currentPage: page
          });
          _context.next = 23;
          break;

        case 19:
          _context.prev = 19;
          _context.t0 = _context["catch"](0);
          console.error('Error in orders:', _context.t0);
          res.status(500).render('error', {
            message: 'An error occurred while loading the orders page.'
          });

        case 23:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 19]]);
};

var orderCancel = function orderCancel(req, res) {
  var orderId, userId, order, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step, _ret;

  return regeneratorRuntime.async(function orderCancel$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          orderId = req.params.id;
          userId = req.session.userId;
          _context3.next = 5;
          return regeneratorRuntime.awrap(orderModel.findOne({
            _id: orderId,
            userID: userId
          }).populate('products.productId'));

        case 5:
          order = _context3.sent;

          if (order) {
            _context3.next = 8;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: 'Order not found.'
          }));

        case 8:
          if (!(order.status === 'Cancelled')) {
            _context3.next = 10;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            message: 'Order is already cancelled.'
          }));

        case 10:
          // Iterate over each product in the order and update its stock
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context3.prev = 13;

          _loop = function _loop() {
            var item, product, productVariant;
            return regeneratorRuntime.async(function _loop$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    item = _step.value;
                    _context2.next = 3;
                    return regeneratorRuntime.awrap(ProductModel.findById(item.productId));

                  case 3:
                    product = _context2.sent;

                    if (product) {
                      _context2.next = 7;
                      break;
                    }

                    console.error("Product with ID ".concat(item.productId, " not found."));
                    return _context2.abrupt("return", "continue");

                  case 7:
                    // Find the product variant matching the order item
                    productVariant = product.properties.find(function (variant) {
                      return variant.color === item.color && variant.size === item.size;
                    });
                    console.log("==========before======", productVariant.stockQuantity);

                    if (!productVariant) {
                      _context2.next = 15;
                      break;
                    }

                    // Increment stock by the quantity ordered
                    productVariant.stockQuantity += item.quantity;
                    _context2.next = 13;
                    return regeneratorRuntime.awrap(product.save());

                  case 13:
                    _context2.next = 16;
                    break;

                  case 15:
                    console.error("Variant not found for product ".concat(product._id, ", color: ").concat(item.color, ", size: ").concat(item.size));

                  case 16:
                    console.log("==========After======", productVariant.stockQuantity);

                  case 17:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          };

          _iterator = order.products[Symbol.iterator]();

        case 16:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context3.next = 25;
            break;
          }

          _context3.next = 19;
          return regeneratorRuntime.awrap(_loop());

        case 19:
          _ret = _context3.sent;

          if (!(_ret === "continue")) {
            _context3.next = 22;
            break;
          }

          return _context3.abrupt("continue", 22);

        case 22:
          _iteratorNormalCompletion = true;
          _context3.next = 16;
          break;

        case 25:
          _context3.next = 31;
          break;

        case 27:
          _context3.prev = 27;
          _context3.t0 = _context3["catch"](13);
          _didIteratorError = true;
          _iteratorError = _context3.t0;

        case 31:
          _context3.prev = 31;
          _context3.prev = 32;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 34:
          _context3.prev = 34;

          if (!_didIteratorError) {
            _context3.next = 37;
            break;
          }

          throw _iteratorError;

        case 37:
          return _context3.finish(34);

        case 38:
          return _context3.finish(31);

        case 39:
          // Update order status to 'Cancelled'
          order.status = 'Cancelled';
          _context3.next = 42;
          return regeneratorRuntime.awrap(order.save());

        case 42:
          res.status(200).json({
            message: 'Order cancelled successfully.'
          });
          _context3.next = 49;
          break;

        case 45:
          _context3.prev = 45;
          _context3.t1 = _context3["catch"](0);
          console.error('Error in orderCancel:', _context3.t1);
          res.status(500).json({
            message: 'An error occurred while cancelling the order.'
          });

        case 49:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 45], [13, 27, 31, 39], [32,, 34, 38]]);
};

var orderReturn = function orderReturn(req, res) {
  var orderId, userId, order, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _loop2, _iterator2, _step2, _ret2;

  return regeneratorRuntime.async(function orderReturn$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          orderId = req.params.id;
          userId = req.session.userId;
          _context5.next = 5;
          return regeneratorRuntime.awrap(orderModel.findOne({
            _id: orderId,
            userID: userId
          }).populate('products.productId'));

        case 5:
          order = _context5.sent;

          if (order) {
            _context5.next = 8;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            message: 'Order not found.'
          }));

        case 8:
          if (!(order.status !== 'Shipped')) {
            _context5.next = 10;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            message: 'Order cannot be returned as it is not shipped.'
          }));

        case 10:
          // Update order status to 'Returned'
          order.status = 'Returned';
          _context5.next = 13;
          return regeneratorRuntime.awrap(order.save());

        case 13:
          // Adjust product stock (reverse the order)
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context5.prev = 16;

          _loop2 = function _loop2() {
            var item, product, productVariant;
            return regeneratorRuntime.async(function _loop2$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    item = _step2.value;
                    _context4.next = 3;
                    return regeneratorRuntime.awrap(ProductModel.findById(item.productId));

                  case 3:
                    product = _context4.sent;

                    if (product) {
                      _context4.next = 7;
                      break;
                    }

                    console.error("Product with ID ".concat(item.productId, " not found."));
                    return _context4.abrupt("return", "continue");

                  case 7:
                    // Find the product variant matching the order item
                    productVariant = product.properties.find(function (variant) {
                      return variant.color === item.color && variant.size === item.size;
                    });

                    if (!productVariant) {
                      _context4.next = 14;
                      break;
                    }

                    // Increment stock by the quantity ordered
                    productVariant.stockQuantity += item.quantity;
                    _context4.next = 12;
                    return regeneratorRuntime.awrap(product.save());

                  case 12:
                    _context4.next = 15;
                    break;

                  case 14:
                    console.error("Variant not found for product ".concat(product._id, ", color: ").concat(item.color, ", size: ").concat(item.size));

                  case 15:
                  case "end":
                    return _context4.stop();
                }
              }
            });
          };

          _iterator2 = order.products[Symbol.iterator]();

        case 19:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context5.next = 28;
            break;
          }

          _context5.next = 22;
          return regeneratorRuntime.awrap(_loop2());

        case 22:
          _ret2 = _context5.sent;

          if (!(_ret2 === "continue")) {
            _context5.next = 25;
            break;
          }

          return _context5.abrupt("continue", 25);

        case 25:
          _iteratorNormalCompletion2 = true;
          _context5.next = 19;
          break;

        case 28:
          _context5.next = 34;
          break;

        case 30:
          _context5.prev = 30;
          _context5.t0 = _context5["catch"](16);
          _didIteratorError2 = true;
          _iteratorError2 = _context5.t0;

        case 34:
          _context5.prev = 34;
          _context5.prev = 35;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 37:
          _context5.prev = 37;

          if (!_didIteratorError2) {
            _context5.next = 40;
            break;
          }

          throw _iteratorError2;

        case 40:
          return _context5.finish(37);

        case 41:
          return _context5.finish(34);

        case 42:
          res.status(200).json({
            message: 'Order returned successfully.'
          });
          _context5.next = 49;
          break;

        case 45:
          _context5.prev = 45;
          _context5.t1 = _context5["catch"](0);
          console.error('Error in orderReturn:', _context5.t1);
          res.status(500).json({
            message: 'An error occurred while returning the order.'
          });

        case 49:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 45], [16, 30, 34, 42], [35,, 37, 41]]);
};

var viewOrderDetails = function viewOrderDetails(req, res) {
  var orderId, userId, userEmail, userProfile, order;
  return regeneratorRuntime.async(function viewOrderDetails$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          orderId = req.params.orderId;
          userId = req.session.userId;
          userEmail = req.session.email;
          _context6.next = 6;
          return regeneratorRuntime.awrap(userModel.findOne({
            email: userEmail
          }));

        case 6:
          userProfile = _context6.sent;
          _context6.next = 9;
          return regeneratorRuntime.awrap(orderModel.findById(orderId).populate('products.productId'));

        case 9:
          order = _context6.sent;

          if (order) {
            _context6.next = 12;
            break;
          }

          return _context6.abrupt("return", res.status(404).send('Order not found'));

        case 12:
          console.log("////////////-------", order.products); // Render the order details view with the order data

          res.render('orderDetails', {
            isUser: req.session.isUser,
            Username: req.session.Username,
            userProfile: userProfile,
            order: order
          });
          _context6.next = 20;
          break;

        case 16:
          _context6.prev = 16;
          _context6.t0 = _context6["catch"](0);
          console.error('Error fetching order details:', _context6.t0);
          res.status(500).send('Server error');

        case 20:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 16]]);
};

module.exports = {
  orders: orders,
  orderCancel: orderCancel,
  viewOrderDetails: viewOrderDetails,
  orderReturn: orderReturn
};