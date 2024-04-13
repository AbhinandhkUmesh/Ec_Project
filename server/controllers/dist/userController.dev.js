"use strict";

var userModel = require('../models/usermodel');

var bcrypt = require('bcrypt');

var otpSend = require("../middleware/otp");

var _require = require('console'),
    log = _require.log;

var index = function index(req, res) {
  return regeneratorRuntime.async(function index$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          try {
            if (req.session.isUser) {
              res.redirect('/home');
            } else {
              res.render('home', {
                isUser: req.session.isUser
              });
              console.log("index Page");
            }
          } catch (error) {
            console.log("Error rendering index page: " + error);
            res.status(500).send("Internal Server Error");
          }

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
};

var login = function login(req, res) {
  try {
    var _message = req.query.error;

    if (req.session.isUser) {
      res.redirect('/home');
    } else {
      res.render('userlogin', {
        isUser: req.session.isUser,
        message: _message
      });
    }
  } catch (error) {
    console.log("Error rendering user login page: " + error);
    res.status(500).send("Internal Server Error");
  }
};

var signupPage = function signupPage(req, res) {
  try {
    var _message2 = req.query.message;
    res.render("signup", {
      isUser: req.session.isUser,
      message: _message2
    });
    console.log("User signup");
  } catch (error) {
    console.log("Error rendering user signup page: " + error);
    res.status(500).send("Internal Server Error signup");
  }
};

var OTP;

var signUp = function signUp(req, res) {
  try {
    console.log(req.body);
    req.session.userDetails = req.body;
    message = "";
    var email = req.body.email;
    console.log("sending otp");
    var otpData = otpSend.sendmail(email);
    console.log(otpData);
    OTP = otpData;
    console.log("OTP received is: " + otpData);
    res.render("otppage", {
      OTP: OTP,
      email: email,
      message: message,
      isUser: req.session.isUser
    });
    console.log("User OTP Page");
  } catch (err) {
    console.log("error in veriy otp" + err);
  }
};

var authOTP = function authOTP(req, res) {
  var otp, storedOTP, hashedPassword, registeredUser;
  return regeneratorRuntime.async(function authOTP$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          otp = req.body.otp;
          storedOTP = OTP;
          console.log(otp, "=====1st test=====", storedOTP); // Retrieve the OTP stored in the session

          if (!(otp === storedOTP)) {
            _context2.next = 19;
            break;
          }

          // Compare the entered OTP with the stored one
          console.log("=====2st test====="); // Check if userDetails and password exist in the session

          if (!(!req.session.userDetails || !req.session.userDetails.password)) {
            _context2.next = 8;
            break;
          }

          throw new Error("User details or password not found in session.");

        case 8:
          _context2.next = 10;
          return regeneratorRuntime.awrap(bcrypt.hash(req.session.userDetails.password.toString(), 10));

        case 10:
          hashedPassword = _context2.sent;
          // Create a new user with hashed password
          registeredUser = new userModel({
            Username: req.session.userDetails.Username,
            password: hashedPassword,
            email: req.session.userDetails.email,
            status: true,
            isAdmin: 0
          });
          console.log("=====3st test=====");
          _context2.next = 15;
          return regeneratorRuntime.awrap(registeredUser.save());

        case 15:
          // Save the user to the database
          console.log("", registeredUser);
          res.redirect("/login");
          _context2.next = 20;
          break;

        case 19:
          res.render("otppage", {
            email: req.session.userDetails.email,
            message: "Invalid OTP entered",
            isUser: req.session.isUser
          });

        case 20:
          _context2.next = 26;
          break;

        case 22:
          _context2.prev = 22;
          _context2.t0 = _context2["catch"](0);
          console.log("Error while authenticating OTP: " + _context2.t0);
          res.status(500).send("Internal Server Error");

        case 26:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 22]]);
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
    message = req.session.otpError;
    res.redirect("/otp");
    console.log("USER RESEND OTP PAGE");
  } catch (error) {
    console.log("Error while resending OTP :" + error);
  }
};

var otpPage = function otpPage(req, res) {
  try {
    var _message3 = 0;
    var email = req.session.email;
    res.render('otppage', {
      isUser: req.session.isUser,
      message: "Invalid OTP entered",
      email: email
    });
  } catch (error) {
    console.log("Error rendering user otp page: " + error);
    res.status(500).send("Internal Server Error on otp");
  }
};

var checkUserIn = function checkUserIn(req, res) {
  var email, userProfile, checkPass;
  return regeneratorRuntime.async(function checkUserIn$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          console.log("check 1");
          email = req.body.email;
          _context3.next = 5;
          return regeneratorRuntime.awrap(userModel.findOne({
            email: email
          }));

        case 5:
          userProfile = _context3.sent;
          console.log(email, "check 2", userProfile);

          if (userProfile) {
            _context3.next = 11;
            break;
          }

          console.log("User not found in the database.");
          req.session.error = "Not a registered user. Please register first.";
          return _context3.abrupt("return", res.redirect('/login'));

        case 11:
          console.log(req.body.password);
          console.log(userProfile.password);
          _context3.next = 15;
          return regeneratorRuntime.awrap(bcrypt.compare(req.body.password, userProfile.password));

        case 15:
          checkPass = _context3.sent;

          if (!checkPass) {
            _context3.next = 24;
            break;
          }

          console.log("Password checked");
          req.session.isUser = true;
          req.session.Username = userProfile.Username;
          req.session.email = email;
          return _context3.abrupt("return", res.redirect("/home"));

        case 24:
          console.log("Incorrect password");
          req.session.error = "Incorrect password. Please try again.";
          return _context3.abrupt("return", res.redirect("/login"));

        case 27:
          _context3.next = 34;
          break;

        case 29:
          _context3.prev = 29;
          _context3.t0 = _context3["catch"](0);
          console.log("Error validating user:", _context3.t0);
          req.session.error = "Internal Server Error. Please try again later.";
          return _context3.abrupt("return", res.status(500).redirect("/login"));

        case 34:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 29]]);
};

var redirectUser = function redirectUser(req, res) {
  return regeneratorRuntime.async(function redirectUser$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          try {
            res.render("home", {
              isUser: req.session.isUser
            });
          } catch (error) {
            console.log("Error redirecting user: " + error);
            res.status(500).send("Internal Server Error");
          }

        case 1:
        case "end":
          return _context4.stop();
      }
    }
  });
};

var userDetails = function userDetails(req, res) {
  var userEmail, userProfile;
  return regeneratorRuntime.async(function userDetails$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          userEmail = req.session.email;
          _context5.next = 4;
          return regeneratorRuntime.awrap(userModel.findOne({
            email: userEmail
          }));

        case 4:
          userProfile = _context5.sent;

          if (req.session.isUser) {
            res.render('userDetails', {
              isUser: req.session.isUser,
              Username: userProfile.Username,
              email: userProfile.email
            });
          } else {
            res.redirect('/login');
          }

          _context5.next = 12;
          break;

        case 8:
          _context5.prev = 8;
          _context5.t0 = _context5["catch"](0);
          console.log("Error redirecting UserPage: " + _context5.t0);
          res.status(500).send("Internal Server Error");

        case 12:
        case "end":
          return _context5.stop();
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

var productdetail = function productdetail(req, res) {
  res.render('product-detail', {
    isUser: req.session.isUser
  });
};

var product = function product(req, res) {
  res.render('product', {
    isUser: req.session.isUser
  });
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
  resendOTP: resendOTP,
  productdetail: productdetail,
  product: product
};