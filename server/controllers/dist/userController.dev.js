"use strict";

var userModel = require('../models/usermodel');

var bcrypt = require('bcrypt');

var otpGenerator = require('otp-generator');

var nodemailer = require('nodemailer');

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
    var error = req.query.error;

    if (req.session.isUser) {
      res.redirect('/home');
    } else {
      res.render('userlogin', {
        error: error
      });
    }
  } catch (error) {
    console.log("Error rendering user login page: " + error);
    res.status(500).send("Internal Server Error");
  }
};

var signup = function signup(req, res) {
  try {
    var message = req.query.message;
    res.render("signup", {
      message: message
    });
    console.log("User signup");
  } catch (error) {
    console.log("Error rendering user signup page: " + error);
    res.status(500).send("Internal Server Error signup");
  }
};

var addUser = function addUser(req, res) {
  var userExist, hashedPassword, registeredUser;
  return regeneratorRuntime.async(function addUser$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(userModel.findOne({
            email: req.body.email
          }));

        case 3:
          userExist = _context2.sent;

          if (!userExist) {
            _context2.next = 6;
            break;
          }

          return _context2.abrupt("return", res.redirect("/signup?message=User with this email already exists"));

        case 6:
          if (!(req.body.password !== req.body.confirmPassword)) {
            _context2.next = 8;
            break;
          }

          return _context2.abrupt("return", res.redirect("/signup?message=Passwords do not match"));

        case 8:
          _context2.next = 10;
          return regeneratorRuntime.awrap(bcrypt.hash(req.body.password, 10));

        case 10:
          hashedPassword = _context2.sent;
          registeredUser = new userModel({
            Username: req.body.Username,
            email: req.body.email,
            password: hashedPassword,
            isAdmin: 0
          });
          req.session.email = registeredUser.email;
          console.log(registeredUser);
          res.redirect('/otpPage');
          return _context2.abrupt("return", registeredUser);

        case 18:
          _context2.prev = 18;
          _context2.t0 = _context2["catch"](0);
          console.error("Error adding user: " + _context2.t0);
          res.status(500).send("Internal Server Error");

        case 22:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 18]]);
};

var otpPage = function otpPage(req, res) {
  try {
    var message = req.query.message;
    var email = req.session.email;
    res.render('otppage', {
      message: message,
      email: email
    });
  } catch (error) {
    console.log("Error rendering user otp page: " + error);
    res.status(500).send("Internal Server Error on otp");
  }
};

var generateOTP = function generateOTP(req, res) {
  var OTP = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false
  });
  console.log(OTP);
  return OTP;
};

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '',
    pass: 'your_password'
  }
});

var sentOtp = function sentOtp(req, res) {
  var email, OTP, mailOption;
  return regeneratorRuntime.async(function sentOtp$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          email = req.session.email;
          console.log(email);
          OTP = generateOTP();
          mailOption = {
            from: 'abhikappana@gmail.com',
            to: email,
            subject: "OTP From ANB_STORE",
            text: "Your OTP is : ".concat(OTP)
          };
          transporter.sendMail(mailOption, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent successfully');
            }
          });

        case 5:
        case "end":
          return _context3.stop();
      }
    }
  });
}; //  const verifyOtp = async (req ,rec) => {
//     try{
//     }
//     catch (error) {
//         console.error("Error occurred:", error);
//         res.status(500).send("Internal Server Error");
//     }
//  }


var checkUserIn = function checkUserIn(req, res) {
  var email, userProfile, checkPass;
  return regeneratorRuntime.async(function checkUserIn$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          email = req.body.email;
          _context4.next = 4;
          return regeneratorRuntime.awrap(userModel.findOne({
            email: email
          }));

        case 4:
          userProfile = _context4.sent;

          if (userProfile) {
            _context4.next = 8;
            break;
          }

          req.session.error = "Not a registered user. Please register first";
          return _context4.abrupt("return", res.redirect('/login'));

        case 8:
          _context4.next = 10;
          return regeneratorRuntime.awrap(bcrypt.compare(req.body.password, userProfile.password));

        case 10:
          checkPass = _context4.sent;

          if (!checkPass) {
            _context4.next = 19;
            break;
          }

          console.log("Password checked");
          req.session.isUser = true;
          req.session.Username = userProfile.Username;
          req.session.email = email;
          return _context4.abrupt("return", res.redirect("/home"));

        case 19:
          req.session.error = "Incorrect password";
          console.log("Incorrect password");
          return _context4.abrupt("return", res.redirect("/login"));

        case 22:
          _context4.next = 28;
          break;

        case 24:
          _context4.prev = 24;
          _context4.t0 = _context4["catch"](0);
          console.log("Error validating user: " + _context4.t0);
          res.status(500).send("Internal Server Error");

        case 28:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 24]]);
};

var redirectUser = function redirectUser(req, res) {
  return regeneratorRuntime.async(function redirectUser$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
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
          return _context5.stop();
      }
    }
  });
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
              username: userProfile.Username,
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
  signup: signup,
  addUser: addUser,
  checkUserIn: checkUserIn,
  redirectUser: redirectUser,
  userDetails: userDetails,
  logout: logout,
  otpPage: otpPage,
  sentOtp: sentOtp
};