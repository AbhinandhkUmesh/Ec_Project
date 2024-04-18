"use strict";

var userModel = require('../models/usermodel');

var bcrypt = require('bcrypt');

var otpSend = require("../middleware/otp");

var _require = require('../middleware/usermiddleware'),
    isUser = _require.isUser;

var productModel = require('../models/productmodel');

var categoryModel = require('../models/categorymodel');

var index = function index(req, res) {
  var category, products;
  return regeneratorRuntime.async(function index$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(categoryModel.find({}));

        case 3:
          category = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(productModel.find({}));

        case 6:
          products = _context.sent;
          console.log("=====", products);

          if (req.session.isUser) {
            res.redirect('/home');
          } else {
            res.render('home', {
              isUser: req.session.isUser,
              error: req.session.error,
              category: category,
              products: products
            });
            console.log("index Page");
          }

          _context.next = 15;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          console.log("Error rendering index page: " + _context.t0);
          res.status(500).send("Internal Server Error");

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

var login = function login(req, res) {
  try {
    if (req.session.isUser) {
      res.redirect('/home');
    } else {
      res.render('userlogin', {
        isUser: req.session.isUser,
        error: req.query.error
      });
    }
  } catch (error) {
    console.log("Error rendering user login page: " + error);
    res.status(500).send("Internal Server Error");
  }
};

var signupPage = function signupPage(req, res) {
  try {
    res.render("signup", {
      isUser: req.session.isUser,
      error: req.query.error
    });
    console.log("User signup");
  } catch (error) {
    console.log("Error rendering user signup page: " + error);
    res.status(500).send("Internal Server Error signup");
  }
};

var OTP;

var signUp = function signUp(req, res) {
  var email, Username, alreadyExist, otpData;
  return regeneratorRuntime.async(function signUp$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          email = req.body.email;
          Username = req.body.Username; // Assuming username is in req.body
          // Check if email or username already exists

          _context2.next = 5;
          return regeneratorRuntime.awrap(userModel.findOne({
            $or: [{
              email: email
            }, {
              Username: Username
            }]
          }));

        case 5:
          alreadyExist = _context2.sent;

          if (!alreadyExist) {
            _context2.next = 13;
            break;
          }

          if (!(alreadyExist.email === email)) {
            _context2.next = 11;
            break;
          }

          return _context2.abrupt("return", res.redirect('/signup?error=Email Already Exist'));

        case 11:
          if (!(alreadyExist.Username === Username)) {
            _context2.next = 13;
            break;
          }

          return _context2.abrupt("return", res.redirect('/signup?error=Username Already Exist'));

        case 13:
          // Set user details in session
          req.session.userDetails = req.body; // Assuming otpSend.sendmail(email) is an asynchronous function

          console.log("sending otp");
          _context2.next = 17;
          return regeneratorRuntime.awrap(otpSend.sendmail(email));

        case 17:
          otpData = _context2.sent;
          console.log(otpData); // Store OTP in session

          req.session.OTP = otpData; // Redirect to OTP verification page

          return _context2.abrupt("return", res.render("otppage", {
            OTP: otpData,
            email: email,
            error: req.query.error,
            isUser: req.session.isUser
          }));

        case 23:
          _context2.prev = 23;
          _context2.t0 = _context2["catch"](0);
          console.log("Error in signUp: ", _context2.t0);
          return _context2.abrupt("return", res.status(500).send("Internal Server Error"));

        case 27:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 23]]);
};

var authOTP = function authOTP(req, res) {
  var otp, storedOTP, hashedPassword, registeredUser;
  return regeneratorRuntime.async(function authOTP$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          otp = req.body.otp;
          storedOTP = OTP;
          console.log(otp, "=====1st test=====", storedOTP); // Retrieve the OTP stored in the session

          if (!(otp === storedOTP)) {
            _context3.next = 20;
            break;
          }

          // Compare the entered OTP with the stored one
          console.log("=====2st test====="); // Check if userDetails and password exist in the session

          if (!(!req.session.userDetails || !req.session.userDetails.password)) {
            _context3.next = 9;
            break;
          }

          res.redirect('/signup?error=User details or password not found');
          throw new Error("User details or password not found in session.");

        case 9:
          _context3.next = 11;
          return regeneratorRuntime.awrap(bcrypt.hash(req.session.userDetails.password.toString(), 10));

        case 11:
          hashedPassword = _context3.sent;
          // Create a new user with hashed password
          registeredUser = new userModel({
            Username: req.session.userDetails.Username,
            password: hashedPassword,
            email: req.session.userDetails.email,
            status: true,
            isAdmin: 0
          });
          console.log("=====3st test=====");
          _context3.next = 16;
          return regeneratorRuntime.awrap(registeredUser.save());

        case 16:
          // Save the user to the database
          console.log("", registeredUser);
          res.redirect("/login");
          _context3.next = 21;
          break;

        case 20:
          res.render("otppage", {
            email: req.session.userDetails.email,
            error: "Invalid OTP entered",
            isUser: req.session.isUser
          });

        case 21:
          _context3.next = 27;
          break;

        case 23:
          _context3.prev = 23;
          _context3.t0 = _context3["catch"](0);
          console.log("Error while authenticating OTP: " + _context3.t0);
          res.status(500).send("Internal Server Error");

        case 27:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 23]]);
};

var resendOTP = function resendOTP(req, res) {
  try {
    console.log("Session User Detail:", req.session.userDetails);
    var email = req.session.userDetails.email;
    console.log("=====Resending OTP to email:" + email);
    var otpRData = otpSend.sendmail(email);
    console.log("===== otpResendData is ========" + otpRData);
    newOTP = otpRData;
    console.log("OTP received after 60s is: " + +" and timestamp is:  " + otpRData);
    req.session.otpTimestamp = otpRData[1];
    error = req.session.otpError;
    res.redirect("/otp");
    console.log("USER RESEND OTP PAGE");
  } catch (error) {
    console.log("Error while resending OTP :" + error);
  }
};

var otpPage = function otpPage(req, res) {
  try {
    var message = 0;
    var email = req.session.email;
    res.render('otppage', {
      isUser: req.session.isUser,
      error: "Invalid OTP entered",
      email: email
    });
  } catch (error) {
    console.log("Error rendering user otp page: " + error);
    res.status(500).send("Internal Server Error on otp");
  }
};

var checkUserIn = function checkUserIn(req, res) {
  var email, userProfile, checkPass;
  return regeneratorRuntime.async(function checkUserIn$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          console.log("check 1");
          email = req.body.email;
          _context4.next = 5;
          return regeneratorRuntime.awrap(userModel.findOne({
            email: email
          }));

        case 5:
          userProfile = _context4.sent;
          console.log(email, "check 2", userProfile);

          if (userProfile) {
            _context4.next = 13;
            break;
          }

          console.log("User not found in the database.");
          req.session.error = "Not a registered user. Please register first.";
          return _context4.abrupt("return", res.redirect('/login?error=User not found'));

        case 13:
          if (userProfile.status) {
            _context4.next = 15;
            break;
          }

          return _context4.abrupt("return", res.redirect('/login?error=Your account is Blocked'));

        case 15:
          console.log(req.body.password);
          console.log(userProfile.password);
          _context4.next = 19;
          return regeneratorRuntime.awrap(bcrypt.compare(req.body.password, userProfile.password));

        case 19:
          checkPass = _context4.sent;

          if (!checkPass) {
            _context4.next = 28;
            break;
          }

          console.log("Password checked");
          req.session.isUser = true;
          req.session.Username = userProfile.Username;
          req.session.email = email;
          return _context4.abrupt("return", res.redirect("/home"));

        case 28:
          console.log("Incorrect password");
          req.session.error = "Incorrect password. Please try again.";
          return _context4.abrupt("return", res.redirect("/login?error=Incorrect password"));

        case 31:
          _context4.next = 38;
          break;

        case 33:
          _context4.prev = 33;
          _context4.t0 = _context4["catch"](0);
          console.log("Error validating user:", _context4.t0);
          req.session.error = "Internal Server Error. Please try again later.";
          return _context4.abrupt("return", res.status(500).redirect("/login"));

        case 38:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 33]]);
};

var redirectUser = function redirectUser(req, res) {
  var category, products;
  return regeneratorRuntime.async(function redirectUser$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(categoryModel.find({}));

        case 3:
          category = _context5.sent;
          _context5.next = 6;
          return regeneratorRuntime.awrap(productModel.find({}));

        case 6:
          products = _context5.sent;
          res.render("home", {
            isUser: req.session.isUser,
            products: products,
            category: category
          });
          _context5.next = 14;
          break;

        case 10:
          _context5.prev = 10;
          _context5.t0 = _context5["catch"](0);
          console.log("Error redirecting user: " + _context5.t0);
          res.status(500).send("Internal Server Error");

        case 14:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var userDetails = function userDetails(req, res) {
  var userEmail, userProfile;
  return regeneratorRuntime.async(function userDetails$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          userEmail = req.session.email;
          _context6.next = 4;
          return regeneratorRuntime.awrap(userModel.findOne({
            email: userEmail
          }));

        case 4:
          userProfile = _context6.sent;

          if (req.session.isUser) {
            res.render('userDetails', {
              isUser: req.session.isUser,
              Username: userProfile.Username,
              email: userProfile.email
            });
          } else {
            res.redirect('/login');
          }

          _context6.next = 12;
          break;

        case 8:
          _context6.prev = 8;
          _context6.t0 = _context6["catch"](0);
          console.log("Error redirecting UserPage: " + _context6.t0);
          res.status(500).send("Internal Server Error");

        case 12:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var logout = function logout(req, res) {
  try {
    req.session.destroy(function (err) {
      if (err) {
        console.log("Error clearing sessions:", err);
        return res.status(500).send("Internal Server Error");
      }

      res.redirect("/login");
    });
    console.log("User logged out");
  } catch (error) {
    console.log("Error during user signout:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  index: index,
  login: login,
  signupPage: signupPage,
  authOTP: authOTP,
  otpPage: otpPage,
  checkUserIn: checkUserIn,
  redirectUser: redirectUser,
  userDetails: userDetails,
  logout: logout,
  signUp: signUp,
  resendOTP: resendOTP
};