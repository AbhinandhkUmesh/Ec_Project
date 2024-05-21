"use strict";

var cartModel = require('../models/cartmodel');

var Product = require('../models/productmodel');

var ObjectId = require('mongoose').Types.ObjectId;

var cartpage = function cartpage(req, res) {
  var userId, cart;
  return regeneratorRuntime.async(function cartpage$(_context) {
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
          console.log(cart);
          res.render('shoppingCart', {
            isUser: req.session.isUser,
            // Assuming req.session.isUser indicates user authentication
            cart: cart
          });
          _context.next = 13;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          console.error("Error in cartpage:", _context.t0);
          res.render('error'); // Render an error page if there's an error

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var addToCart = function addToCart(req, res) {
  var userId, _req$body, color, size, quantity, productId, cart, existingItem, product, newQuantity, newProductTotal, _product, newItem;

  return regeneratorRuntime.async(function addToCart$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          userId = req.session.userId;
          _req$body = req.body, color = _req$body.color, size = _req$body.size, quantity = _req$body.quantity;
          productId = req.params.productId;
          console.log("++++++////", productId, color, size, quantity, "/////+++++++++");
          _context2.next = 7;
          return regeneratorRuntime.awrap(cartModel.findOne({
            userId: userId
          }));

        case 7:
          cart = _context2.sent;
          console.log("----------/////", cart);

          if (!cart) {
            // Create a new cart if user doesn't have one
            cart = new cartModel({
              userId: userId,
              cartTotal: 0,
              items: []
            });
          } // Check if item already exists in the cart


          existingItem = cart.items.find(function (item) {
            return item.productId.toString() === productId && item.color === color && item.size === size;
          });

          if (!existingItem) {
            _context2.next = 24;
            break;
          }

          _context2.next = 14;
          return regeneratorRuntime.awrap(Product.findById(productId));

        case 14:
          product = _context2.sent;

          if (product) {
            _context2.next = 17;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: 'Product not found'
          }));

        case 17:
          console.log("===========////", product); // Update quantity and product total

          newQuantity = existingItem.quantity + parseInt(quantity, 10);
          newProductTotal = newQuantity * product.rate;
          existingItem.quantity = newQuantity;
          existingItem.productTotal = newProductTotal;
          _context2.next = 32;
          break;

        case 24:
          _context2.next = 26;
          return regeneratorRuntime.awrap(Product.findById(productId));

        case 26:
          _product = _context2.sent;

          if (_product) {
            _context2.next = 29;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: 'Product not found'
          }));

        case 29:
          newItem = {
            productId: new ObjectId(productId),
            color: color,
            size: size,
            quantity: parseInt(quantity, 10),
            productTotal: parseInt(quantity, 10) * _product.rate // Assuming 'rate' is the product price

          };
          cart.items.push(newItem);
          console.log("=========", newItem);

        case 32:
          cart.cartTotal = cart.items.reduce(function (total, item) {
            return total + item.productTotal;
          }, 0);
          console.log("=========;;;;;", cart);
          _context2.next = 36;
          return regeneratorRuntime.awrap(cart.save());

        case 36:
          res.status(200).json({
            message: 'Item added to cart successfully',
            cart: cart
          });
          _context2.next = 43;
          break;

        case 39:
          _context2.prev = 39;
          _context2.t0 = _context2["catch"](0);
          console.log("Error in add to cart", _context2.t0);
          res.render('error');

        case 43:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 39]]);
};

var updateCartItem = function updateCartItem(req, res) {
  var userId, productId, quantity, cart, item, product;
  return regeneratorRuntime.async(function updateCartItem$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          userId = req.session.userId;
          productId = req.params.productId;
          quantity = req.body.quantity;
          console.log("++++++++++++_____+++++", quantity);
          _context3.next = 7;
          return regeneratorRuntime.awrap(cartModel.findOne({
            userId: userId
          }));

        case 7:
          cart = _context3.sent;
          // if (!cart) {
          //     return res.status(404).json({
          //         message: 'Cart not found'
          //     });
          // }
          item = cart.items.find(function (item) {
            return item.productId.toString() === productId;
          }); // if (!item) {
          //     return res.status(404).json({
          //         message: 'Item not found in cart'
          //     });
          // }

          _context3.next = 11;
          return regeneratorRuntime.awrap(Product.findById(productId));

        case 11:
          product = _context3.sent;

          if (product) {
            _context3.next = 14;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: 'Product not found'
          }));

        case 14:
          item.quantity = parseInt(quantity, 10);
          item.productTotal = item.quantity * product.rate;
          console.log("++++++++++/////+-", item.quantity, item.productTotal);
          cart.cartTotal = cart.items.reduce(function (total, item) {
            return total + item.productTotal;
          }, 0);
          console.log("++++++++++", cart.cartTotal);
          res.status(200).json({
            productTotal: item.productTotal,
            cartTotal: cart.cartTotal
          });
          _context3.next = 22;
          return regeneratorRuntime.awrap(cart.save());

        case 22:
          _context3.next = 28;
          break;

        case 24:
          _context3.prev = 24;
          _context3.t0 = _context3["catch"](0);
          console.log('Error updating cart item:', _context3.t0);
          res.status(500).json({
            message: 'Internal server error'
          });

        case 28:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 24]]);
};

var deleteCartItem = function deleteCartItem(req, res) {
  var productId, userId, cart, itemIndex;
  return regeneratorRuntime.async(function deleteCartItem$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          productId = req.params.productId;
          userId = req.session.userId;
          _context4.next = 5;
          return regeneratorRuntime.awrap(cartModel.findOne({
            userId: userId
          }));

        case 5:
          cart = _context4.sent;

          if (cart) {
            _context4.next = 8;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: 'Cart not found'
          }));

        case 8:
          itemIndex = cart.items.findIndex(function (item) {
            return item.productId.toString() === productId;
          });

          if (!(itemIndex === -1)) {
            _context4.next = 11;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: 'Product not found in cart'
          }));

        case 11:
          cart.items.splice(itemIndex, 1);
          cart.cartTotal = cart.items.reduce(function (total, item) {
            return total + item.productTotal;
          }, 0);
          _context4.next = 15;
          return regeneratorRuntime.awrap(cart.save());

        case 15:
          res.json({
            cartTotal: cart.cartTotal
          });
          _context4.next = 22;
          break;

        case 18:
          _context4.prev = 18;
          _context4.t0 = _context4["catch"](0);
          console.error('Error deleting cart item:', _context4.t0);
          res.status(500).json({
            message: 'Server error'
          });

        case 22:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 18]]);
};

module.exports = {
  cartpage: cartpage,
  addToCart: addToCart,
  updateCartItem: updateCartItem,
  deleteCartItem: deleteCartItem
};