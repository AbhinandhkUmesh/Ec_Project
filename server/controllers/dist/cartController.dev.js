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
          res.render('shoppingCart', {
            isUser: req.session.isUser,
            cart: cart
          });
          _context.next = 12;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.error("Error in cartpage:", _context.t0);
          res.render('error');

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var addToCart = function addToCart(req, res) {
  var userId, _req$body, color, size, quantity, productId, cart, existingItem, product, productVariant, newItem;

  return regeneratorRuntime.async(function addToCart$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          userId = req.session.userId;
          _req$body = req.body, color = _req$body.color, size = _req$body.size, quantity = _req$body.quantity;
          productId = req.params.productId;
          _context2.next = 6;
          return regeneratorRuntime.awrap(cartModel.findOne({
            userId: userId
          }));

        case 6:
          cart = _context2.sent;

          if (!cart) {
            cart = new cartModel({
              userId: userId,
              cartTotal: 0,
              items: []
            });
          }

          existingItem = cart.items.find(function (item) {
            return item.productId.toString() === productId && item.color === color && item.size === size;
          });
          _context2.next = 11;
          return regeneratorRuntime.awrap(Product.findById(productId));

        case 11:
          product = _context2.sent;
          productVariant = product.properties.find(function (item) {
            return item.color === color && item.size === size;
          });

          if (!(!product || !productVariant)) {
            _context2.next = 15;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: 'Product not found'
          }));

        case 15:
          if (!(productVariant.stockQuantity < quantity)) {
            _context2.next = 17;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: 'Insufficient stock'
          }));

        case 17:
          if (existingItem) {
            existingItem.quantity += parseInt(quantity, 10);
            existingItem.productTotal = existingItem.quantity * product.rate;
          } else {
            newItem = {
              productId: new ObjectId(productId),
              color: color,
              size: size,
              quantity: parseInt(quantity, 10),
              productTotal: parseInt(quantity, 10) * product.rate
            };
            cart.items.push(newItem);
          }

          productVariant.stockQuantity -= parseInt(quantity, 10);
          cart.cartTotal = cart.items.reduce(function (total, item) {
            return total + item.productTotal;
          }, 0);
          _context2.next = 22;
          return regeneratorRuntime.awrap(product.save());

        case 22:
          _context2.next = 24;
          return regeneratorRuntime.awrap(cart.save());

        case 24:
          res.status(200).json({
            message: 'Item added to cart successfully',
            cart: cart
          });
          _context2.next = 31;
          break;

        case 27:
          _context2.prev = 27;
          _context2.t0 = _context2["catch"](0);
          console.log("Error in add to cart", _context2.t0);
          res.status(500).json({
            message: 'Internal server error'
          });

        case 31:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 27]]);
};

var updateCartItem = function updateCartItem(req, res) {
  var userId, productId, quantity, cart, item, product, productVariant, increment, decrement;
  return regeneratorRuntime.async(function updateCartItem$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          userId = req.session.userId;
          productId = req.params.productId;
          quantity = req.body.quantity;
          _context3.next = 6;
          return regeneratorRuntime.awrap(cartModel.findOne({
            userId: userId
          }));

        case 6:
          cart = _context3.sent;

          if (cart) {
            _context3.next = 9;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: 'Cart not found'
          }));

        case 9:
          item = cart.items.find(function (item) {
            return item.productId.toString() === productId;
          });

          if (item) {
            _context3.next = 12;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: 'Item not found in cart'
          }));

        case 12:
          _context3.next = 14;
          return regeneratorRuntime.awrap(Product.findById(productId));

        case 14:
          product = _context3.sent;
          productVariant = product.properties.find(function (variant) {
            return variant.color === item.color && variant.size === item.size;
          });

          if (!(!product || !productVariant)) {
            _context3.next = 18;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: 'Product not found'
          }));

        case 18:
          if (!(quantity > item.quantity)) {
            _context3.next = 25;
            break;
          }

          increment = quantity - item.quantity;

          if (!(productVariant.stockQuantity < increment)) {
            _context3.next = 22;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            message: 'Insufficient stock'
          }));

        case 22:
          productVariant.stockQuantity -= increment;
          _context3.next = 27;
          break;

        case 25:
          decrement = item.quantity - quantity;
          productVariant.stockQuantity += decrement;

        case 27:
          item.quantity = parseInt(quantity, 10);
          item.productTotal = item.quantity * product.rate;
          cart.cartTotal = cart.items.reduce(function (total, item) {
            return total + item.productTotal;
          }, 0);
          _context3.next = 32;
          return regeneratorRuntime.awrap(product.save());

        case 32:
          _context3.next = 34;
          return regeneratorRuntime.awrap(cart.save());

        case 34:
          res.status(200).json({
            productTotal: item.productTotal,
            cartTotal: cart.cartTotal,
            stockQuantity: productVariant.stockQuantity
          });
          _context3.next = 41;
          break;

        case 37:
          _context3.prev = 37;
          _context3.t0 = _context3["catch"](0);
          console.log('Error updating cart item:', _context3.t0);
          res.status(500).json({
            message: 'Internal server error'
          });

        case 41:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 37]]);
};

var deleteCartItem = function deleteCartItem(req, res) {
  var productId, userId, cart, itemIndex, item, product, productVariant;
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
          item = cart.items[itemIndex];
          _context4.next = 14;
          return regeneratorRuntime.awrap(Product.findById(productId));

        case 14:
          product = _context4.sent;
          productVariant = product.properties.find(function (variant) {
            return variant.color === item.color && variant.size === item.size;
          });

          if (productVariant) {
            _context4.next = 18;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: 'Product variant not found'
          }));

        case 18:
          productVariant.stockQuantity += item.quantity;
          cart.items.splice(itemIndex, 1);
          cart.cartTotal = cart.items.reduce(function (total, item) {
            return total + item.productTotal;
          }, 0);
          _context4.next = 23;
          return regeneratorRuntime.awrap(product.save());

        case 23:
          _context4.next = 25;
          return regeneratorRuntime.awrap(cart.save());

        case 25:
          res.json({
            cartTotal: cart.cartTotal
          });
          _context4.next = 32;
          break;

        case 28:
          _context4.prev = 28;
          _context4.t0 = _context4["catch"](0);
          console.error('Error deleting cart item:', _context4.t0);
          res.status(500).json({
            message: 'Server error'
          });

        case 32:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 28]]);
};

module.exports = {
  cartpage: cartpage,
  addToCart: addToCart,
  updateCartItem: updateCartItem,
  deleteCartItem: deleteCartItem
};