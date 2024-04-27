"use strict";

var cartpage = function cartpage(req, res) {
  return regeneratorRuntime.async(function cartpage$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          try {
            res.render('shoppingCart', {
              isUser: req.session.isUser // Assuming req.session.isUser indicates user authentication

            });
          } catch (error) {
            console.error("Error in cartpage:", error);
            res.render('error'); // Render an error page if there's an error
          }

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports = {
  cartpage: cartpage
};