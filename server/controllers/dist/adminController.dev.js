"use strict";

var userModel = require('../models/usermodel');

var bcrypt = require('bcrypt');

var adminLogin = function adminLogin(req, res) {
  return regeneratorRuntime.async(function adminLogin$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (req.session.isAdmin) {
            console.log("entry 1");
            res.redirect('/admin/dashboard');
          } else {
            console.log("rendered adminlogin");
            res.render('adminlogin', {
              error: req.query.error
            });
          }

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
};

var adminDashboard = function adminDashboard(req, res) {
  var email, adminData;
  return regeneratorRuntime.async(function adminDashboard$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          console.log("check1");
          email = req.body.email;
          _context2.next = 5;
          return regeneratorRuntime.awrap(userModel.findOne({
            email: email
          }));

        case 5:
          adminData = _context2.sent;
          console.log(adminData);

          if (!(adminData && adminData.isAdmin == 1)) {
            _context2.next = 15;
            break;
          }

          console.log("check2");
          _context2.next = 11;
          return regeneratorRuntime.awrap(bcrypt.compare(req.body.password, adminData.password));

        case 11:
          password = _context2.sent;

          if (password) {
            req.session.isAdmin = true;
            req.session.username = adminData.Username;
            res.redirect("/admin/dashboard");
          } else {
            res.redirect("/admin?error=Invalid password");
          }

          _context2.next = 16;
          break;

        case 15:
          res.redirect("/admin?error=Not authorized");

        case 16:
          _context2.next = 21;
          break;

        case 18:
          _context2.prev = 18;
          _context2.t0 = _context2["catch"](0);
          console.log("Admin Dashboard error: " + _context2.t0);

        case 21:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 18]]);
};

var toDashboard = function toDashboard(req, res) {
  try {
    if (req.session.isAdmin) {
      res.render("Dashboard", {
        Username: req.session.username
      });
      console.log("Admin Dashboard");
    }
  } catch (error) {
    console.log("Dashboard  Error:" + error);
  }
};

var adminlogout = function adminlogout(req, res) {
  try {
    // Clear all sessions
    console.log("trying to logout");
    req.session.destroy(function (err) {
      if (err) {
        console.log("Error clearing sessions:", err);
        return res.status(500).send("Internal Server Error");
      } // Redirect to adminlogin page


      res.redirect("/admin");
    });
    console.log("admin logged out");
  } catch (error) {
    console.log("Error during user signout:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  adminLogin: adminLogin,
  adminDashboard: adminDashboard,
  toDashboard: toDashboard,
  adminlogout: adminlogout
};