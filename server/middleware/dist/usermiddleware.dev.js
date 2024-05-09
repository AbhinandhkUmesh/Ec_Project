"use strict";

var isUser = function isUser(req, res, next) {
  var currentTime, sessionTimeout;
  return regeneratorRuntime.async(function isUser$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          try {
            // Check if the user is authenticated
            if (req.session.isUser) {
              // Check if the session has not expired
              currentTime = Date.now();
              sessionTimeout = 30 * 60 * 1000; // 30 minutes in milliseconds

              if (req.session.lastAccess && currentTime - req.session.lastAccess < sessionTimeout) {
                req.session.lastAccess = currentTime; // Update last access time

                next(); // Continue to the next middleware or route handler
              } else {
                // Session has expired, redirect to login
                req.session.destroy(); // Clear session data

                res.redirect('/login?expired=true');
              }
            } else {
              // User is not authenticated, redirect to login
              res.redirect('/login');
            }
          } catch (err) {
            console.log("user controller isUser error: " + err);
            res.status(500).send("Internal Server Error");
          }

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports = {
  isUser: isUser
};