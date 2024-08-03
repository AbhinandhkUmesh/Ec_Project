"use strict";

var Razorpay = require("razorpay");

require("dotenv").config();

var razorpayInstance = new Razorpay({
  key_id: process.env.PAYMENT_GATEWAY_API_KEY,
  key_secret: process.env.PAYMENT_GATEWAY_KEY_SECRET // Replace with your key secret

});

var createRazorpayOrder = function createRazorpayOrder(req, res) {
  var finalPrice, options;
  return regeneratorRuntime.async(function createRazorpayOrder$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          finalPrice = req.body.finalPrice; // Extract finalPrice directly from req.body

          console.log('Request body:', req.body);
          console.log("+++++++++createRazorpayOrder");
          _context.prev = 3;

          if (!(!finalPrice || isNaN(finalPrice))) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: "Invalid finalPrice"
          }));

        case 6:
          console.log("///finalPrice:", finalPrice);
          options = {
            amount: finalPrice,
            // Amount in paise
            currency: "INR",
            receipt: "order_rcptid_11" // Unique identifier for the receipt

          };
          razorpayInstance.orders.create(options, function (err, order) {
            if (err) {
              console.error("Error creating Razorpay order:", err);
              return res.status(500).json({
                message: "Failed to create order"
              });
            }

            console.log("////order:", order);
            res.status(200).json(order);
          });
          _context.next = 15;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](3);
          console.error("Error creating Razorpay order:", _context.t0);
          res.status(500).json({
            message: "Internal Server Error"
          });

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 11]]);
};

module.exports = {
  createRazorpayOrder: createRazorpayOrder
};