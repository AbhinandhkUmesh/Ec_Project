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

var signUp = function signUp(req, res) {
  var email, Username, _password, conformPassword, uppercaseRegex, lowercaseRegex, numberRegex, specialCharRegex, alreadyExist, otpData;

  return regeneratorRuntime.async(function signUp$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          email = req.body.email;
          Username = req.body.Username; // Assuming username is in req.body

          _password = req.body.password;
          conformPassword = req.body.password;
          uppercaseRegex = /[A-Z]/;
          lowercaseRegex = /[a-z]/;
          numberRegex = /[0-9]/;
          specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/; // Check if email or username already exists

          _context2.next = 11;
          return regeneratorRuntime.awrap(userModel.findOne({
            $or: [{
              email: email
            }, {
              Username: Username
            }]
          }));

        case 11:
          alreadyExist = _context2.sent;

          if (!alreadyExist) {
            _context2.next = 19;
            break;
          }

          if (!(alreadyExist.email === email)) {
            _context2.next = 17;
            break;
          }

          return _context2.abrupt("return", res.redirect('/signup?error=Email Already Exists'));

        case 17:
          if (!(alreadyExist.Username === Username)) {
            _context2.next = 19;
            break;
          }

          return _context2.abrupt("return", res.redirect('/signup?error=Username Already Exists'));

        case 19:
          if (!(conformPassword !== _password)) {
            _context2.next = 21;
            break;
          }

          return _context2.abrupt("return", res.redirect('/signup?error=Conform your password'));

        case 21:
          if (!(_password.length < 6 || !uppercaseRegex.test(_password) || !lowercaseRegex.test(_password) || !numberRegex.test(_password) || !specialCharRegex.test(_password))) {
            _context2.next = 23;
            break;
          }

          return _context2.abrupt("return", res.redirect('/signup?error=Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.'));

        case 23:
          // Set user details in session
          req.session.userDetails = {
            email: email,
            Username: Username,
            password: _password
          }; // Assuming otpSend.sendmail(email) is an asynchronous function

          console.log("Sending OTP to:", email);
          _context2.next = 27;
          return regeneratorRuntime.awrap(otpSend.sendmail(email));

        case 27:
          otpData = _context2.sent;
          console.log("OTP sent:", otpData); // Store OTP in session

          req.session.OTP = otpData; // Redirect to OTP verification page

          return _context2.abrupt("return", res.render("otppage", {
            OTP: otpData,
            email: email,
            error: req.query.error,
            isUser: req.session.isUser
          }));

        case 33:
          _context2.prev = 33;
          _context2.t0 = _context2["catch"](0);
          console.log("Error in signUp: ", _context2.t0);
          return _context2.abrupt("return", res.status(500).send("Internal Server Error"));

        case 37:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 33]]);
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
            email: req.session.userDetails.email,
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
            email: req.session.userDetails.email,
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
          res.status(500).send("Internal Server Error");

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
          console.log("Session User Detail:", req.session.userDetails);
          email = req.session.userDetails.email;
          console.log("=====Resending OTP to email:" + email);
          _context4.next = 6;
          return regeneratorRuntime.awrap(otpSend.sendmail(email));

        case 6:
          otpRData = _context4.sent;
          console.log("===== otpResendData is ========" + otpRData);
          req.session.OTP = otpRData;
          req.session.otpTimestamp = Date.now(); // Update the timestamp

          req.session.otpError = null; // Reset OTP error

          res.redirect("/otp");
          console.log("USER RESEND OTP PAGE");
          _context4.next = 20;
          break;

        case 15:
          _context4.prev = 15;
          _context4.t0 = _context4["catch"](0);
          console.log("Error while resending OTP :" + _context4.t0);
          req.session.otpError = "Error resending OTP"; // Set OTP error

          res.redirect("/otp");

        case 20:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 15]]);
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
    res.status(500).send("Internal Server Error on otp");
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
            _context5.next = 29;
            break;
          }

          console.log("Password checked");
          req.session.isUser = true;
          req.session.Username = userProfile.Username;
          req.session.email = email;
          return _context5.abrupt("return", res.redirect("/home"));

        case 29:
          console.log("Incorrect password");
          req.session.error = "Incorrect password. Please try again.";
          return _context5.abrupt("return", res.redirect("/login?error=Incorrect password"));

        case 32:
          _context5.next = 39;
          break;

        case 34:
          _context5.prev = 34;
          _context5.t0 = _context5["catch"](0);
          console.log("Error validating user:", _context5.t0);
          req.session.error = "Internal Server Error. Please try again later.";
          return _context5.abrupt("return", res.status(500).redirect("/login"));

        case 39:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 34]]);
};

var redirectUser = function redirectUser(req, res) {
  var category, products;
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
          res.render("home", {
            isUser: req.session.isUser,
            products: products,
            category: category
          });
          _context6.next = 14;
          break;

        case 10:
          _context6.prev = 10;
          _context6.t0 = _context6["catch"](0);
          console.log("Error redirecting user: " + _context6.t0);
          res.status(500).send("Internal Server Error");

        case 14:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var changePassword = function changePassword(req, res) {
  try {
    res.render('changepassword', {
      isUser: req.session.isUser,
      error: req.query.error
    });
  } catch (error) {
    console.log("Error during user forgot password:", error);
    res.status(500).send("Internal Server Error");
  }
};

var changeVerify = function changeVerify(req, res) {
  var email, newPassword, oldPassword, uppercaseRegex, lowercaseRegex, numberRegex, specialCharRegex, userProfile, verifyOldPassword, verifyNewPassword, hashedPassword;
  return regeneratorRuntime.async(function changeVerify$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          email = req.session.email;
          newPassword = req.body.newPassword;
          oldPassword = req.body.oldPassword;
          uppercaseRegex = /[A-Z]/;
          lowercaseRegex = /[a-z]/;
          numberRegex = /[0-9]/;
          specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/; // Check if email or username already exists

          _context7.next = 10;
          return regeneratorRuntime.awrap(userModel.findOne({
            email: email
          }));

        case 10:
          userProfile = _context7.sent;

          if (!(!userProfile.password === newPassword)) {
            _context7.next = 13;
            break;
          }

          return _context7.abrupt("return", res.redirect('/forgotPassword?error= Please Sign in User not found'));

        case 13:
          _context7.next = 15;
          return regeneratorRuntime.awrap(bcrypt.compare(oldPassword, userProfile.password));

        case 15:
          verifyOldPassword = _context7.sent;
          _context7.next = 18;
          return regeneratorRuntime.awrap(bcrypt.compare(newPassword, userProfile.password));

        case 18:
          verifyNewPassword = _context7.sent;

          if (verifyOldPassword) {
            _context7.next = 21;
            break;
          }

          return _context7.abrupt("return", res.redirect('/changePassword?error= Oldpassword is wrong'));

        case 21:
          if (verifyNewPassword) {
            _context7.next = 23;
            break;
          }

          return _context7.abrupt("return", res.redirect('/changePassword?error= Old password and new Password  is same '));

        case 23:
          if (!(newPassword.length < 6 || !uppercaseRegex.test(password) || !lowercaseRegex.test(password) || !numberRegex.test(password) || !specialCharRegex.test(password))) {
            _context7.next = 25;
            break;
          }

          return _context7.abrupt("return", res.redirect('/changePassword?error=Password must be at least 6 characters,one uppercase letter, one lowercase letter, one number, and one special character.'));

        case 25:
          _context7.next = 27;
          return regeneratorRuntime.awrap(bcrypt.hash(newPassword.toString(), 10));

        case 27:
          hashedPassword = _context7.sent;
          _context7.next = 30;
          return regeneratorRuntime.awrap(userModel.updateOne({
            email: email
          }, {
            $set: {
              password: hashedPassword
            }
          }));

        case 30:
          res.redirect('/login?error=Password Changed');
          _context7.next = 37;
          break;

        case 33:
          _context7.prev = 33;
          _context7.t0 = _context7["catch"](0);
          console.log("Error during user forgot password:", _context7.t0);
          res.status(500).send("Internal Server Error");

        case 37:
        case "end":
          return _context7.stop();
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
    res.status(500).send("Internal Server Error");
  }
};

var userDetails = function userDetails(req, res) {
  var userEmail, userProfile;
  return regeneratorRuntime.async(function userDetails$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          userEmail = req.session.email;
          _context8.next = 4;
          return regeneratorRuntime.awrap(userModel.findOne({
            email: userEmail
          }));

        case 4:
          userProfile = _context8.sent;
          console.log("|||||||||||", userProfile);

          if (req.session.isUser) {
            res.render('userDetails', {
              userProfile: userProfile,
              isUser: req.session.isUser,
              Username: req.session.Username
            });
            console.log("================99999999", userProfile.image);
          } else {
            res.redirect('/login');
          }

          _context8.next = 13;
          break;

        case 9:
          _context8.prev = 9;
          _context8.t0 = _context8["catch"](0);
          console.log("Error redirecting UserPage: " + _context8.t0);
          res.status(500).send("Internal Server Error");

        case 13:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var userUpdate = function userUpdate(req, res) {
  var userID, updateData, image, dataUpload;
  return regeneratorRuntime.async(function userUpdate$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          userID = req.params.id;
          updateData = req.body; // Get the filename from uploaded files

          image = req.files[0].filename;
          console.log(req.files, "file:", image); // Update user data in the database

          _context9.next = 7;
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

        case 7:
          dataUpload = _context9.sent;
          // Check the result of the database update
          console.log("Data Upload Result:", dataUpload);
          res.redirect("/userdetails");
          _context9.next = 16;
          break;

        case 12:
          _context9.prev = 12;
          _context9.t0 = _context9["catch"](0);
          console.error("Error updating user:", _context9.t0);
          res.status(500).send("Internal Server Error");

        case 16:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var userImageDelete = function userImageDelete(req, res) {
  var userID, imageDelete;
  return regeneratorRuntime.async(function userImageDelete$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          userID = req.params.id;
          _context10.next = 4;
          return regeneratorRuntime.awrap(userModel.updateOne({
            _id: userID
          }, {
            $set: {
              image: ""
            }
          }));

        case 4:
          imageDelete = _context10.sent;
          console.log(imageDelete);
          res.redirect("/userdetails");
          _context10.next = 13;
          break;

        case 9:
          _context10.prev = 9;
          _context10.t0 = _context10["catch"](0);
          console.error("Error updating user:", _context10.t0);
          res.status(500).send("Internal Server Error");

        case 13:
        case "end":
          return _context10.stop();
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