"use strict";

var userModel = require('../models/usermodel');

var bcrypt = require('bcrypt');

var Wishlist = require('../models/wishlistmodel');

var otpSend = require("../middleware/otp");

var _require = require('../middleware/usermiddleware'),
    isUser = _require.isUser;

var productModel = require('../models/productmodel');

var categoryModel = require('../models/categorymodel');

var addressModel = require('../models/addressmodel');

var wishlist = require('../models/wishlistmodel');

var ObjectId = require('mongoose').Types.ObjectId;

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
          return regeneratorRuntime.awrap(productModel.find({
            status: true
          }).limit(8));

        case 6:
          products = _context.sent;
          console.log("=====", products);

          if (req.session.isUser) {
            res.redirect('/home');
          } else {
            res.render('home', {
              isUser: req.session.isUser,
              error: req.session.error,
              wishlist: res.locals.wishlist,
              category: category,
              products: products
            });
          }

          _context.next = 15;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          console.log("Error rendering index page: " + _context.t0);
          res.render('error');

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
        error: req.query.error,
        wishlist: res.locals.wishlist
      });
    }
  } catch (error) {
    console.log("Error rendering user login page: " + error);
    res.render('error');
  }
};

var signupPage = function signupPage(req, res) {
  try {
    res.render("signup", {
      isUser: req.session.isUser,
      error: req.query.error,
      wishlist: res.locals.wishlist
    });
    console.log("User signup");
  } catch (error) {
    console.log("Error rendering user signup page: " + error);
    res.render('error');
  }
};

var signUp = function signUp(req, res) {
  var email, Username, _password, conformPassword, alreadyExist, otpData;

  return regeneratorRuntime.async(function signUp$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          email = req.body.email;
          Username = req.body.Username; // Assuming username is in req.body

          _password = req.body.password;
          conformPassword = req.body.password; // const uppercaseRegex = /[A-Z]/;
          // const lowercaseRegex = /[a-z]/;
          // const numberRegex = /[0-9]/;
          // const specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

          if (!(email === '' && _password === '')) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return", res.redirect('/signup?error=Enter your details'));

        case 7:
          _context2.next = 9;
          return regeneratorRuntime.awrap(userModel.findOne({
            $or: [{
              email: email
            }, {
              Username: Username
            }]
          }));

        case 9:
          alreadyExist = _context2.sent;

          if (!alreadyExist) {
            _context2.next = 17;
            break;
          }

          if (!(alreadyExist.email === email)) {
            _context2.next = 15;
            break;
          }

          return _context2.abrupt("return", res.redirect('/signup?error=Email Already Exists'));

        case 15:
          if (!(alreadyExist.Username === Username)) {
            _context2.next = 17;
            break;
          }

          return _context2.abrupt("return", res.redirect('/signup?error=Username Already Exists'));

        case 17:
          // if (conformPassword !== password) {
          //     return res.redirect('/signup?error=Conform your password');
          // }
          // if (password.length < 6 ||
          //     !uppercaseRegex.test(password) ||
          //     !lowercaseRegex.test(password) ||
          //     !numberRegex.test(password) ||
          //     !specialCharRegex.test(password)) {
          //     return res.redirect('/signup?error=Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.');
          // }
          // Set user details in session
          req.session.userDetails = {
            email: email,
            Username: Username,
            password: _password
          };
          req.session.email = email; // Assuming otpSend.sendmail(email) is an asynchronous function

          console.log("Sending OTP to:", email);
          _context2.next = 22;
          return regeneratorRuntime.awrap(otpSend.sendmail(email));

        case 22:
          otpData = _context2.sent;
          console.log("OTP sent:", otpData); // Store OTP in session

          req.session.OTP = otpData; // Redirect to OTP verification page

          return _context2.abrupt("return", res.render("otppage", {
            OTP: otpData,
            email: email,
            error: req.query.error,
            isUser: req.session.isUser
          }));

        case 28:
          _context2.prev = 28;
          _context2.t0 = _context2["catch"](0);
          console.log("Error in signUp: ", _context2.t0);
          res.render('error');

        case 32:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 28]]);
};

var authOTP = function authOTP(req, res) {
  var otp, storedOTP, hashedPassword, registeredUser;
  return regeneratorRuntime.async(function authOTP$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          otp = req.body.otp;
          storedOTP = req.session.OTP;
          console.log(otp, "=====1st test=====", storedOTP); // Retrieve the OTP stored in the session

          if (!(otp === storedOTP)) {
            _context3.next = 22;
            break;
          }

          // Compare the entered OTP with the stored one
          console.log("=====2nd test====="); // Check if userDetails and password exist in the session

          if (!(!req.session.userDetails || !req.session.userDetails.password)) {
            _context3.next = 9;
            break;
          }

          res.redirect('/signup?error=User details or password not found');
          throw new Error("User details or password not found in session.");

        case 9:
          console.log(req.session.userDetails.password); // Hash the password

          _context3.next = 12;
          return regeneratorRuntime.awrap(bcrypt.hash(req.session.userDetails.password, 10));

        case 12:
          hashedPassword = _context3.sent;
          console.log(hashedPassword); // Create a new user with hashed password

          registeredUser = new userModel({
            Username: req.session.userDetails.Username,
            password: hashedPassword,
            email: req.session.email,
            status: true,
            isAdmin: 0
          });
          console.log("=====3rd test=====");
          _context3.next = 18;
          return regeneratorRuntime.awrap(registeredUser.save());

        case 18:
          // Save the user to the database
          console.log("Registered User:", registeredUser);
          res.redirect("/login");
          _context3.next = 23;
          break;

        case 22:
          res.render("otppage", {
            email: req.session.email,
            error: "Invalid OTP entered",
            isUser: req.session.isUser
          });

        case 23:
          _context3.next = 29;
          break;

        case 25:
          _context3.prev = 25;
          _context3.t0 = _context3["catch"](0);
          console.log("Error while authenticating OTP: " + _context3.t0);
          res.render('error');

        case 29:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 25]]);
};

var resendOTP = function resendOTP(req, res) {
  var email, otpRData;
  return regeneratorRuntime.async(function resendOTP$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          email = req.session.email;
          console.log("=====Resending OTP to email:" + email);
          _context4.next = 5;
          return regeneratorRuntime.awrap(otpSend.sendmail(email));

        case 5:
          otpRData = _context4.sent;
          console.log("===== otpResendData is ========" + otpRData);
          req.session.OTP = otpRData;
          req.session.otpTimestamp = Date.now(); // Update the timestamp

          req.session.otpError = null; // Reset OTP error

          res.redirect("/otp");
          console.log("USER RESEND OTP PAGE");
          _context4.next = 18;
          break;

        case 14:
          _context4.prev = 14;
          _context4.t0 = _context4["catch"](0);
          console.log("Error while resending OTP :" + _context4.t0);
          res.render('error');

        case 18:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 14]]);
};

var otpPage = function otpPage(req, res) {
  try {
    var email = req.session.userDetails.email;
    res.render('otppage', {
      isUser: req.session.isUser,
      error: req.session.otpError,
      email: email
    });
  } catch (error) {
    console.log("Error rendering user otp page: " + error);
    res.render('error');
  }
};

var checkUserIn = function checkUserIn(req, res) {
  var email, userProfile, checkPass;
  return regeneratorRuntime.async(function checkUserIn$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          console.log("check 1");
          email = req.body.email;
          _context5.next = 5;
          return regeneratorRuntime.awrap(userModel.findOne({
            email: email
          }));

        case 5:
          userProfile = _context5.sent;
          console.log(email, "check 2", userProfile);

          if (userProfile) {
            _context5.next = 13;
            break;
          }

          console.log("User not found in the database.");
          req.session.error = "Not a registered user. Please register first.";
          return _context5.abrupt("return", res.redirect('/login?error=User not found'));

        case 13:
          if (userProfile.status) {
            _context5.next = 15;
            break;
          }

          return _context5.abrupt("return", res.redirect('/login?error=Your account is Blocked'));

        case 15:
          console.log(req.body.password);
          console.log(userProfile.password);
          _context5.next = 19;
          return regeneratorRuntime.awrap(bcrypt.compare(req.body.password, userProfile.password));

        case 19:
          checkPass = _context5.sent;
          console.log(checkPass);

          if (!checkPass) {
            _context5.next = 33;
            break;
          }

          console.log("Password checked");
          req.session.isUser = true;
          req.session.lastAccess = Date.now();
          req.session.userId = userProfile._id;
          req.session.Username = userProfile.Username;
          req.session.userDetails = userProfile;
          req.session.userId = userProfile._id;
          req.session.email = email;
          return _context5.abrupt("return", res.redirect("/home"));

        case 33:
          console.log("Incorrect password");
          req.session.error = "Incorrect password. Please try again.";
          return _context5.abrupt("return", res.redirect("/login?error=Incorrect password"));

        case 36:
          _context5.next = 43;
          break;

        case 38:
          _context5.prev = 38;
          _context5.t0 = _context5["catch"](0);
          console.log("Error validating user:", _context5.t0);
          req.session.error = "Internal Server Error. Please try again later.";
          res.render('error');

        case 43:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 38]]);
};

var redirectUser = function redirectUser(req, res) {
  var category, products, userId, wishlistProduct;
  return regeneratorRuntime.async(function redirectUser$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(categoryModel.find({}));

        case 3:
          category = _context6.sent;
          _context6.next = 6;
          return regeneratorRuntime.awrap(productModel.find({}));

        case 6:
          products = _context6.sent;
          userId = req.session.userId;
          _context6.next = 10;
          return regeneratorRuntime.awrap(wishlist.findOne({
            user: userId
          }).populate('product'));

        case 10:
          wishlistProduct = _context6.sent;
          res.render("home", {
            isUser: req.session.isUser,
            products: products,
            category: category,
            wishlist: res.locals.wishlist
          });
          _context6.next = 18;
          break;

        case 14:
          _context6.prev = 14;
          _context6.t0 = _context6["catch"](0);
          console.log("Error redirecting user: " + _context6.t0);
          res.render('error');

        case 18:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 14]]);
};

var forgotPassword = function forgotPassword(req, res) {
  try {
    res.render('ForgotPassword', {
      isUser: req.session.isUser,
      error: req.query.error
    });
  } catch (error) {
    console.log("Error during user forgot password:", error);
    res.render('error');
  }
};

var forgotpasswordOtp = function forgotpasswordOtp(req, res) {
  var email, UserNotExist, otpData;
  return regeneratorRuntime.async(function forgotpasswordOtp$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          email = req.body.email;
          console.log(email);
          _context7.next = 5;
          return regeneratorRuntime.awrap(userModel.findOne({
            email: email
          }));

        case 5:
          UserNotExist = _context7.sent;

          if (UserNotExist) {
            _context7.next = 8;
            break;
          }

          return _context7.abrupt("return", res.redirect('/signup?error=Email Not Exists'));

        case 8:
          _context7.next = 10;
          return regeneratorRuntime.awrap(otpSend.sendmail(email));

        case 10:
          otpData = _context7.sent;
          req.session.email = email;
          req.session.OTP = otpData;
          res.redirect('/forgotOtpPage');
          _context7.next = 20;
          break;

        case 16:
          _context7.prev = 16;
          _context7.t0 = _context7["catch"](0);
          console.log("Error during user forgot password:", _context7.t0);
          res.render('error');

        case 20:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 16]]);
};

var forgotOtpPage = function forgotOtpPage(req, res) {
  return regeneratorRuntime.async(function forgotOtpPage$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          try {
            console.log(req.session.email);
            console.log(req.session.OTP);
            res.render('ForgotOtpPage', {
              email: req.session.email,
              isUser: req.session.isUser,
              error: req.query.error
            });
          } catch (error) {
            console.log("Error during user forgot password:", error);
            res.render('error');
          }

        case 1:
        case "end":
          return _context8.stop();
      }
    }
  });
};

var forgotPassVerifyOtp = function forgotPassVerifyOtp(req, res) {
  var otpdata, otp;
  return regeneratorRuntime.async(function forgotPassVerifyOtp$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          try {
            otpdata = req.session.OTP;
            otp = req.body.otp;
            console.log(otpdata, "=======", otp);

            if (otpdata === otp) {
              res.redirect('/newpasswordPage');
            } else {
              res.render("ForgotOtpPage", {
                email: req.session.email,
                error: "Invalid OTP entered",
                isUser: req.session.isUser
              });
            }
          } catch (error) {
            console.log("Error during user forgot password:", error);
            res.render('error');
          }

        case 1:
        case "end":
          return _context9.stop();
      }
    }
  });
};

var newpasswordPage = function newpasswordPage(req, res) {
  return regeneratorRuntime.async(function newpasswordPage$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          try {
            res.render('newpassword', {
              email: req.session.email,
              isUser: req.session.isUser,
              error: req.query.error
            });
          } catch (error) {
            console.log("Error during user forgot password:", error);
            res.render('error');
          }

        case 1:
        case "end":
          return _context10.stop();
      }
    }
  });
};

var ForgotresendOTP = function ForgotresendOTP(req, res) {
  var email, otpRData;
  return regeneratorRuntime.async(function ForgotresendOTP$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          email = req.session.email;
          console.log("=====Resending OTP to email:" + email);
          _context11.next = 5;
          return regeneratorRuntime.awrap(otpSend.sendmail(email));

        case 5:
          otpRData = _context11.sent;
          console.log("===== otpResendData is ========" + otpRData);
          req.session.OTP = otpRData;
          req.session.otpTimestamp = Date.now(); // Update the timestamp

          req.session.otpError = null; // Reset OTP error

          res.redirect("/forgotOtpPage");
          console.log("USER RESEND OTP PAGE");
          _context11.next = 18;
          break;

        case 14:
          _context11.prev = 14;
          _context11.t0 = _context11["catch"](0);
          console.log("Error while resending OTP :" + _context11.t0);
          res.render('error');

        case 18:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 14]]);
};

var newPassCreate = function newPassCreate(req, res) {
  var email, _password2, conformPassword, uppercaseRegex, lowercaseRegex, numberRegex, specialCharRegex, hashedPassword, updatedUserpassword;

  return regeneratorRuntime.async(function newPassCreate$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          email = req.session.email;
          _password2 = req.body.password;
          conformPassword = req.body.conformPassword;
          console.log(_password2, "=========", conformPassword);
          uppercaseRegex = /[A-Z]/;
          lowercaseRegex = /[a-z]/;
          numberRegex = /[0-9]/;
          specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

          if (_password2 !== conformPassword) {
            res.redirect('/newpasswordPage?error = Conform password is wrong');
          }

          if (!(_password2.length < 6 || !uppercaseRegex.test(_password2) || !lowercaseRegex.test(_password2) || !numberRegex.test(_password2) || !specialCharRegex.test(_password2))) {
            _context12.next = 12;
            break;
          }

          return _context12.abrupt("return", res.redirect('/newpasswordPage?error=Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.'));

        case 12:
          _context12.next = 14;
          return regeneratorRuntime.awrap(bcrypt.hash(_password2, 10));

        case 14:
          hashedPassword = _context12.sent;
          _context12.next = 17;
          return regeneratorRuntime.awrap(userModel.updateOne({
            email: email
          }, {
            $set: {
              password: hashedPassword
            }
          }));

        case 17:
          updatedUserpassword = _context12.sent;
          console.log("++++++", updatedUserpassword);
          res.redirect('/login');
          _context12.next = 26;
          break;

        case 22:
          _context12.prev = 22;
          _context12.t0 = _context12["catch"](0);
          console.log("Error during user forgot password:", _context12.t0);
          res.render('error');

        case 26:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 22]]);
};

var changePassword = function changePassword(req, res) {
  return regeneratorRuntime.async(function changePassword$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          try {
            res.render('changepassword', {
              isUser: req.session.isUser,
              error: req.query.error
            });
          } catch (error) {
            console.log("Error during user forgot password:", error);
            res.render('error');
          }

        case 1:
        case "end":
          return _context13.stop();
      }
    }
  });
};

var changeVerify = function changeVerify(req, res) {
  var email, newPassword, oldPassword, uppercaseRegex, lowercaseRegex, numberRegex, specialCharRegex, userProfile, verifyOldPassword, verifyNewPassword, hashedPassword;
  return regeneratorRuntime.async(function changeVerify$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;
          email = req.session.email;
          newPassword = req.body.newPassword;
          oldPassword = req.body.oldPassword;
          uppercaseRegex = /[A-Z]/;
          lowercaseRegex = /[a-z]/;
          numberRegex = /[0-9]/;
          specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/; // Check if email or username already exists

          _context14.next = 10;
          return regeneratorRuntime.awrap(userModel.findOne({
            email: email
          }));

        case 10:
          userProfile = _context14.sent;

          if (!(!userProfile.password === newPassword)) {
            _context14.next = 13;
            break;
          }

          return _context14.abrupt("return", res.redirect('/forgotPassword?error= Please Sign in User not found'));

        case 13:
          _context14.next = 15;
          return regeneratorRuntime.awrap(bcrypt.compare(oldPassword, userProfile.password));

        case 15:
          verifyOldPassword = _context14.sent;
          _context14.next = 18;
          return regeneratorRuntime.awrap(bcrypt.compare(newPassword, userProfile.password));

        case 18:
          verifyNewPassword = _context14.sent;

          if (verifyOldPassword) {
            _context14.next = 21;
            break;
          }

          return _context14.abrupt("return", res.redirect('/changePassword?error= Old password is wrong'));

        case 21:
          if (verifyNewPassword) {
            _context14.next = 23;
            break;
          }

          return _context14.abrupt("return", res.redirect('/changePassword?error= Old password and new Password  is same '));

        case 23:
          if (!(newPassword.length < 6 || !uppercaseRegex.test(password) || !lowercaseRegex.test(password) || !numberRegex.test(password) || !specialCharRegex.test(password))) {
            _context14.next = 25;
            break;
          }

          return _context14.abrupt("return", res.redirect('/changePassword?error=Password must be at least 6 characters,one uppercase letter, one lowercase letter, one number, and one special character.'));

        case 25:
          _context14.next = 27;
          return regeneratorRuntime.awrap(bcrypt.hash(newPassword.toString(), 10));

        case 27:
          hashedPassword = _context14.sent;
          _context14.next = 30;
          return regeneratorRuntime.awrap(userModel.updateOne({
            email: email
          }, {
            $set: {
              password: hashedPassword
            }
          }));

        case 30:
          res.redirect('/login?error=Password Changed');
          _context14.next = 37;
          break;

        case 33:
          _context14.prev = 33;
          _context14.t0 = _context14["catch"](0);
          console.log("Error during user forgot password:", _context14.t0);
          res.render('error');

        case 37:
        case "end":
          return _context14.stop();
      }
    }
  }, null, null, [[0, 33]]);
};

var logout = function logout(req, res) {
  try {
    if (req.session.timeoutTimer) {
      clearTimeout(req.session.timeoutTimer);
    }

    req.session.destroy(function (err) {
      if (err) {
        console.log("Error clearing sessions:", err);
        return res.status(500).send("Internal Server Error");
      }

      res.redirect("/login");
    });
  } catch (error) {
    console.log("Error during user signout:", error);
    res.render('error');
  }
};

var userDetails = function userDetails(req, res) {
  var userEmail, userProfile, addressData;
  return regeneratorRuntime.async(function userDetails$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _context15.prev = 0;
          userEmail = req.session.email;
          _context15.next = 4;
          return regeneratorRuntime.awrap(userModel.findOne({
            email: userEmail
          }));

        case 4:
          userProfile = _context15.sent;
          _context15.next = 7;
          return regeneratorRuntime.awrap(addressModel.findOne({
            email: userEmail
          }));

        case 7:
          addressData = _context15.sent;

          if (req.session.isUser) {
            res.render('userDetails', {
              userProfile: userProfile,
              addressData: addressData,
              isUser: req.session.isUser,
              Username: req.session.Username
            });
          } else {
            res.redirect('/login');
          }

          _context15.next = 15;
          break;

        case 11:
          _context15.prev = 11;
          _context15.t0 = _context15["catch"](0);
          console.log("Error redirecting UserPage: " + _context15.t0);
          res.render('error');

        case 15:
        case "end":
          return _context15.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

var userUpdate = function userUpdate(req, res) {
  var userID, updateData, data, dataUpload, image, _dataUpload;

  return regeneratorRuntime.async(function userUpdate$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          _context16.prev = 0;
          userID = req.params.id;
          updateData = req.body;
          _context16.next = 5;
          return regeneratorRuntime.awrap(userModel.find({
            userID: userID
          }));

        case 5:
          data = _context16.sent;

          if (!(req.files[0] == data.image)) {
            _context16.next = 12;
            break;
          }

          _context16.next = 9;
          return regeneratorRuntime.awrap(userModel.updateOne({
            _id: userID
          }, {
            $set: {
              Username: updateData.Username,
              email: updateData.email,
              phone: updateData.phone
            }
          }));

        case 9:
          dataUpload = _context16.sent;
          _context16.next = 16;
          break;

        case 12:
          image = req.files[0].filename;
          _context16.next = 15;
          return regeneratorRuntime.awrap(userModel.updateOne({
            _id: userID
          }, {
            $set: {
              Username: updateData.Username,
              email: updateData.email,
              phone: updateData.phone,
              image: image
            }
          }));

        case 15:
          _dataUpload = _context16.sent;

        case 16:
          // Update user data in the database
          res.redirect("/userdetails");
          _context16.next = 23;
          break;

        case 19:
          _context16.prev = 19;
          _context16.t0 = _context16["catch"](0);
          console.error("Error updating user:", _context16.t0);
          res.render('error');

        case 23:
        case "end":
          return _context16.stop();
      }
    }
  }, null, null, [[0, 19]]);
};

var userImageDelete = function userImageDelete(req, res) {
  var userID, imageDelete;
  return regeneratorRuntime.async(function userImageDelete$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          _context17.prev = 0;
          userID = req.params.id;
          _context17.next = 4;
          return regeneratorRuntime.awrap(userModel.updateOne({
            _id: userID
          }, {
            $set: {
              image: ""
            }
          }));

        case 4:
          imageDelete = _context17.sent;
          console.log(imageDelete);
          res.redirect("/userdetails");
          _context17.next = 13;
          break;

        case 9:
          _context17.prev = 9;
          _context17.t0 = _context17["catch"](0);
          console.error("Error updating user:", _context17.t0);
          res.render('error');

        case 13:
        case "end":
          return _context17.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

module.exports = {
  index: index,
  login: login,
  signupPage: signupPage,
  authOTP: authOTP,
  otpPage: otpPage,
  checkUserIn: checkUserIn,
  redirectUser: redirectUser,
  forgotPassword: forgotPassword,
  forgotpasswordOtp: forgotpasswordOtp,
  forgotPassVerifyOtp: forgotPassVerifyOtp,
  forgotOtpPage: forgotOtpPage,
  newPassCreate: newPassCreate,
  ForgotresendOTP: ForgotresendOTP,
  newpasswordPage: newpasswordPage,
  userDetails: userDetails,
  userUpdate: userUpdate,
  userImageDelete: userImageDelete,
  changePassword: changePassword,
  changeVerify: changeVerify,
  // changeOtpPage,
  logout: logout,
  signUp: signUp,
  resendOTP: resendOTP
};