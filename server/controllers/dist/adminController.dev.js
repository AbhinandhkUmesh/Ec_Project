"use strict";

var userModel = require('../models/usermodel');

var bcrypt = require('bcrypt');

var ObjectId = require('mongoose').Types.ObjectId;

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

var adminShowUsers = function adminShowUsers(req, res) {
  var page, limit, skip, totalUsers, totalPages, user;
  return regeneratorRuntime.async(function adminShowUsers$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          page = req.query.page || 1; // Get page number from query parameters or default to 1

          limit = 6; // Number of documents per page

          skip = (page - 1) * limit; // Calculate the offset

          _context3.next = 6;
          return regeneratorRuntime.awrap(userModel.countDocuments({
            isAdmin: 0
          }));

        case 6:
          totalUsers = _context3.sent;
          // Get total number of users
          totalPages = Math.ceil(totalUsers / limit); // Calculate total pages

          _context3.next = 10;
          return regeneratorRuntime.awrap(userModel.find({
            isAdmin: 0
          }).sort({
            Username: -1
          }).skip(skip).limit(limit));

        case 10:
          user = _context3.sent;
          // Fetch users for the current page
          res.render("userManagement", {
            Username: req.session.username,
            user: user,
            currentPage: page,
            totalPages: totalPages
          });
          console.log("Admin View User");
          _context3.next = 19;
          break;

        case 15:
          _context3.prev = 15;
          _context3.t0 = _context3["catch"](0);
          console.log("Error while Admin showing user data: " + _context3.t0);
          res.status(500).send("Internal Server Error");

        case 19:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

var getUsersPage = function getUsersPage(req, res) {
  var page, limit, skip, users;
  return regeneratorRuntime.async(function getUsersPage$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          page = parseInt(req.query.page) || 1; // Current page number, default to 1 if not provided

          limit = 6; // Number of items per page

          skip = (page - 1) * limit; // Number of items to skip based on the current page

          _context4.next = 6;
          return regeneratorRuntime.awrap(userModel.find({
            isAdmin: 0
          }).skip(skip).limit(limit).sort({
            Username: -1
          }));

        case 6:
          users = _context4.sent;
          res.json(users);
          _context4.next = 14;
          break;

        case 10:
          _context4.prev = 10;
          _context4.t0 = _context4["catch"](0);
          console.log("Error fetching users:", _context4.t0);
          res.status(500).json({
            error: "Internal Server Error"
          });

        case 14:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var userStatus = function userStatus(req, res) {
  var userId, userStatus, updatedStatus;
  return regeneratorRuntime.async(function userStatus$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          userId = req.params.id;
          userStatus = req.query.status;

          if (req.session.isAdmin) {
            _context5.next = 4;
            break;
          }

          return _context5.abrupt("return", res.redirect('/admin'));

        case 4:
          _context5.prev = 4;
          console.log("userStatus check1");

          if (!(userStatus === "true")) {
            _context5.next = 14;
            break;
          }

          console.log("userStatus check2");
          _context5.next = 10;
          return regeneratorRuntime.awrap(userModel.updateOne({
            _id: new ObjectId(userId)
          }, {
            $set: {
              status: false
            }
          }));

        case 10:
          updatedStatus = _context5.sent;
          req.session.isUser = false;
          _context5.next = 20;
          break;

        case 14:
          console.log("userStatus check3");
          console.log(userId);
          _context5.next = 18;
          return regeneratorRuntime.awrap(userModel.updateOne({
            _id: new ObjectId(userId)
          }, {
            $set: {
              status: true
            }
          }));

        case 18:
          updatedStatus = _context5.sent;
          req.session.isUser = true;

        case 20:
          console.log("updatedStatus :", updatedStatus);
          console.log("userStatus check4");
          res.redirect('/admin/userManagement');
          _context5.next = 29;
          break;

        case 25:
          _context5.prev = 25;
          _context5.t0 = _context5["catch"](4);
          console.error("Error updating user status:", _context5.t0);
          res.status(500).send("Internal Server Error");

        case 29:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[4, 25]]);
};

var logout = function logout(req, res) {
  try {
    req.session.destroy(function (err) {
      if (err) {
        console.log("Error clearing sessions:", err);
        return res.status(500).send("Internal Server Error");
      }

      res.redirect("/admin");
    });
    console.log("User logged out");
  } catch (error) {
    console.log("Error during user signout:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  adminLogin: adminLogin,
  adminDashboard: adminDashboard,
  toDashboard: toDashboard,
  adminlogout: adminlogout,
  adminShowUsers: adminShowUsers,
  userStatus: userStatus,
  getUsersPage: getUsersPage,
  logout: logout
};