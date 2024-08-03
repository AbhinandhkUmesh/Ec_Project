"use strict";

var cartModel = require('../models/cartmodel');

var addressModel = require('../models/addressmodel');

var orderModel = require('../models/ordermodel');

var _require = require('uuid'),
    uuidv4 = _require.v4;

var otpGenerator = require("otp-generator");

var Razorpay = require('razorpay');

var crypto = require('crypto'); // RazorPay key id and key secret


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
          res.render('checkoutAddressSelectionPage ', {
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
};

var payment = function payment(req, res) {
  var userId, address, formattedAddress, addressObj, cart;
  return regeneratorRuntime.async(function payment$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          userId = req.session.userId;
          address = req.query.address; // Parse the address if it's in JSON format

          formattedAddress = '';

          if (address) {
            try {
              addressObj = JSON.parse(address);
              formattedAddress = "\n                    ".concat(addressObj.name, ",\n                    ").concat(addressObj.streetAddress, ",\n                    ").concat(addressObj.city, ", ").concat(addressObj.state, ", ").concat(addressObj.postalCode, ",\n                    ").concat(addressObj.country, "\n                ");
            } catch (error) {
              console.error("Error parsing address:", error);
              formattedAddress = "Invalid address format.";
            }
          }

          _context2.next = 7;
          return regeneratorRuntime.awrap(cartModel.findOne({
            userId: userId
          }).populate('items.productId'));

        case 7:
          cart = _context2.sent;
          console.log(formattedAddress);
          res.render('paymentMethodPage', {
            isUser: req.session.isUser,
            // Assuming req.session.isUser indicates user authentication
            cart: cart,
            address: formattedAddress // Use the formatted address

          });
          _context2.next = 16;
          break;

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](0);
          console.error("Error in cartpage:", _context2.t0);
          res.render('error'); // Render an error page if there's an error

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var OrderConformation = function OrderConformation(req, res) {
  var orderID, order;
  return regeneratorRuntime.async(function OrderConformation$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          orderID = req.query.id; // Fetch the order details using the orderID

          _context3.next = 4;
          return regeneratorRuntime.awrap(orderModel.findOne({
            orderID: orderID
          }));

        case 4:
          order = _context3.sent;

          if (order) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", res.status(404).render('error', {
            message: 'Order not found.'
          }));

        case 7:
          res.render('OrderConformation', {
            isUser: req.session.isUser,
            order: order // Pass the order details to the template

          });
          _context3.next = 14;
          break;

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](0);
          console.error('Error in OrderConformation:', _context3.t0);
          res.status(500).render('error', {
            message: 'An error occurred while loading the order confirmation page.'
          });

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var placeOrder = function placeOrder(req, res) {
  var userId, paymentMethod, address, cart, products, totalOrderValue, orderId, newOrder;
  return regeneratorRuntime.async(function placeOrder$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          userId = req.session.userId;
          paymentMethod = req.query.payment;
          address = req.query.address; // Fetch the cart data

          _context4.next = 6;
          return regeneratorRuntime.awrap(cartModel.findOne({
            userId: userId
          }).populate('items.productId'));

        case 6:
          cart = _context4.sent;

          if (!(!cart || cart.items.length === 0)) {
            _context4.next = 9;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            message: 'Cart is empty.'
          }));

        case 9:
          // Prepare products list
          products = cart.items.map(function (item) {
            return {
              productId: item.productId._id,
              name: item.productId.name,
              quantity: item.quantity,
              price: item.productId.price,
              color: item.color,
              size: item.size,
              Image: item.productId.image,
              // Use `item.productId.image` if this field exists in your model
              Product_total: item.price * item.quantity // Compute total price for each product

            };
          });
          totalOrderValue = cart.cartTotal;
          orderId = otpGenerator.generate(6, {
            digits: true,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
          }); // Create a new order

          newOrder = new orderModel({
            userID: userId,
            orderID: orderId,
            user: req.session.userName,
            products: products,
            totalOrderValue: totalOrderValue,
            address: JSON.parse(address),
            date: new Date(),
            paymentMethod: paymentMethod,
            status: 'Pending',
            cancel: 'No'
          }); // Save the order and update cart

          _context4.next = 15;
          return regeneratorRuntime.awrap(newOrder.save());

        case 15:
          _context4.next = 17;
          return regeneratorRuntime.awrap(cartModel.updateOne({
            userId: userId
          }, {
            $set: {
              items: [],
              cartTotal: 0
            }
          }));

        case 17:
          // Send response with order ID
          res.status(200).json({
            orderID: newOrder.orderID
          });
          _context4.next = 24;
          break;

        case 20:
          _context4.prev = 20;
          _context4.t0 = _context4["catch"](0);
          console.error('Error placing order:', _context4.t0);
          res.status(500).json({
            message: 'An error occurred while placing the order. Please try again later.'
          });

        case 24:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 20]]);
};

var verifyRazorpayPayment = function verifyRazorpayPayment(req, res) {
  var _req$body, razorpay_payment_id, razorpay_order_id, razorpay_signature, secret, generated_signature, address, parsedAddress, userId, cart, products, totalOrderValue, orderId, newOrder;

  return regeneratorRuntime.async(function verifyRazorpayPayment$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _req$body = req.body, razorpay_payment_id = _req$body.razorpay_payment_id, razorpay_order_id = _req$body.razorpay_order_id, razorpay_signature = _req$body.razorpay_signature;
          secret = 'ZHHwWxudD39Oq9gfu2KrDEcP'; // Replace with your Razorpay secret
          // Generate the signature

          generated_signature = crypto.createHmac('sha256', secret).update("".concat(razorpay_order_id, "|").concat(razorpay_payment_id)).digest('hex'); // Compare signatures

          if (!(generated_signature !== razorpay_signature)) {
            _context5.next = 7;
            break;
          }

          console.error('Signature mismatch:', {
            generated_signature: generated_signature,
            razorpay_signature: razorpay_signature
          });
          return _context5.abrupt("return", res.status(400).json({
            result: 'failure',
            message: 'Payment verification failed'
          }));

        case 7:
          // Handle address
          address = req.query.address;

          if (address) {
            _context5.next = 11;
            break;
          }

          console.error('Address missing in query params');
          return _context5.abrupt("return", res.status(400).json({
            result: 'failure',
            message: 'Address is required'
          }));

        case 11:
          _context5.prev = 11;
          parsedAddress = JSON.parse(address);
          _context5.next = 19;
          break;

        case 15:
          _context5.prev = 15;
          _context5.t0 = _context5["catch"](11);
          console.error('Error parsing address:', _context5.t0);
          return _context5.abrupt("return", res.status(400).json({
            result: 'failure',
            message: 'Invalid address format'
          }));

        case 19:
          // Fetch the cart data
          userId = req.session.userId;
          _context5.next = 22;
          return regeneratorRuntime.awrap(cartModel.findOne({
            userId: userId
          }).populate('items.productId'));

        case 22:
          cart = _context5.sent;

          if (!(!cart || cart.items.length === 0)) {
            _context5.next = 25;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            message: 'Cart is empty.'
          }));

        case 25:
          // Prepare products list
          products = cart.items.map(function (item) {
            return {
              productId: item.productId._id,
              name: item.productId.name,
              quantity: item.quantity,
              price: item.productId.price,
              color: item.color,
              size: item.size,
              Image: item.productId.image,
              Product_total: item.price * item.quantity
            };
          });
          totalOrderValue = cart.cartTotal;
          orderId = otpGenerator.generate(6, {
            digits: true,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
          }); // Create a new order

          newOrder = new orderModel({
            userID: userId,
            orderID: orderId,
            user: req.session.userName,
            products: products,
            totalOrderValue: totalOrderValue,
            address: parsedAddress,
            // Use parsed address
            date: new Date(),
            paymentMethod: 'RazorPay',
            status: 'Pending',
            cancel: 'No'
          }); // Save the order and update cart

          _context5.next = 31;
          return regeneratorRuntime.awrap(newOrder.save());

        case 31:
          _context5.next = 33;
          return regeneratorRuntime.awrap(cartModel.updateOne({
            userId: userId
          }, {
            $set: {
              items: [],
              cartTotal: 0
            }
          }));

        case 33:
          // Send response with order ID
          res.status(200).json({
            result: 'success',
            orderId: newOrder.orderID
          });
          _context5.next = 40;
          break;

        case 36:
          _context5.prev = 36;
          _context5.t1 = _context5["catch"](0);
          console.error('Error verifying payment and placing order:', _context5.t1);
          res.status(500).json({
            result: 'failure',
            message: 'An error occurred while placing the order. Please try again later.'
          });

        case 40:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 36], [11, 15]]);
};

var placeOrderFailed = function placeOrderFailed(req, res) {
  var paymentMethod, address, cartData, orderId, productData, discountPrice, newOrder;
  return regeneratorRuntime.async(function placeOrderFailed$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          paymentMethod = req.query.payment;
          address = req.query.address;
          _context6.next = 5;
          return regeneratorRuntime.awrap(cartModel.findOne({
            userId: req.session.userId
          }).populate('items.productId'));

        case 5:
          cartData = _context6.sent;

          if (cartData) {
            _context6.next = 8;
            break;
          }

          return _context6.abrupt("return", res.status(400).json({
            message: 'Cart is empty or not found.'
          }));

        case 8:
          orderId = otpGenerator.generate(16, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false
          });
          productData = cartData.items.map(function (item) {
            return {
              productId: item.productId._id,
              name: item.productId.name,
              quantity: item.quantity,
              price: item.productId.price,
              color: item.color,
              size: item.size,
              Image: item.productId.image,
              // Use `item.productId.image` if this field exists in your model
              Product_total: item.price * item.quantity,
              // Compute total price for each product
              status: "Pending",
              cancel: false,
              returnReason: null
            };
          });
          discountPrice = req.session.finalPrice ? cartData.cartTotal - req.session.finalPrice : 0;
          newOrder = new orderModel({
            userID: req.session.userId,
            orderID: orderId,
            user: address.name,
            totalOrderValue: req.session.finalPrice || cartData.cartTotal,
            discount: discountPrice,
            address: address,
            paymentMethod: paymentMethod,
            date: new Date(),
            products: productData,
            status: "Payment Failed"
          });
          _context6.next = 14;
          return regeneratorRuntime.awrap(newOrder.save());

        case 14:
          _context6.next = 16;
          return regeneratorRuntime.awrap(cartModel.deleteOne({
            userId: req.session.userId
          }));

        case 16:
          // Clear session variables
          req.session.finalPrice = null;
          req.session.couponCode = null;
          res.json({
            result: 'success',
            orderId: orderId
          });
          _context6.next = 25;
          break;

        case 21:
          _context6.prev = 21;
          _context6.t0 = _context6["catch"](0);
          console.error('Error in placeOrderFailed:', _context6.t0);
          res.redirect('/userError');

        case 25:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 21]]);
};

module.exports = {
  checkOutPage: checkOutPage,
  payment: payment,
  OrderConformation: OrderConformation,
  placeOrder: placeOrder,
  verifyRazorpayPayment: verifyRazorpayPayment,
  placeOrderFailed: placeOrderFailed
};