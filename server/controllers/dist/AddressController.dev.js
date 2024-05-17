"use strict";

var addressModel = require('../models/addressmodel');

var userModel = require('../models/usermodel');

var addressPage = function addressPage(req, res) {
  var email, userProfile, addressData;
  return regeneratorRuntime.async(function addressPage$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          email = req.session.email;
          _context.next = 4;
          return regeneratorRuntime.awrap(userModel.findOne({
            email: email
          }));

        case 4:
          userProfile = _context.sent;
          _context.next = 7;
          return regeneratorRuntime.awrap(addressModel.findOne({
            userID: req.session.userID
          }));

        case 7:
          addressData = _context.sent;

          if (req.session.isUser) {
            res.render('AddressPage', {
              userProfile: userProfile,
              addressData: addressData,
              isUser: req.session.isUser,
              Username: req.session.Username
            });
          } else {
            res.redirect('/login');
          }

          _context.next = 15;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          console.log("Error redirecting UserPage: " + _context.t0);
          res.render('error');

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

var addressAddPage = function addressAddPage(req, res) {
  var userEmail, userProfile;
  return regeneratorRuntime.async(function addressAddPage$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          userEmail = req.session.email;
          _context2.next = 4;
          return regeneratorRuntime.awrap(userModel.findOne({
            email: userEmail
          }));

        case 4:
          userProfile = _context2.sent;

          if (req.session.isUser) {
            res.render('AddressAdd', {
              userProfile: userProfile,
              isUser: req.session.isUser,
              Username: req.session.Username,
              error: req.query.error
            });
          } else {
            res.redirect('/login');
          }

          _context2.next = 12;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          console.log("Error redirecting addressAddPage: " + _context2.t0);
          res.render('error');

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var AddNewAddress = function AddNewAddress(req, res) {
  var userId, _req$body, name, streetAddress, city, state, postalCode, country, userAddresses, existingAddress, newAddress;

  return regeneratorRuntime.async(function AddNewAddress$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          userId = req.session.userId;
          _req$body = req.body, name = _req$body.name, streetAddress = _req$body.streetAddress, city = _req$body.city, state = _req$body.state, postalCode = _req$body.postalCode, country = _req$body.country; // Check if the user already has the specified address

          _context3.next = 5;
          return regeneratorRuntime.awrap(addressModel.findOne({
            userId: userId
          }));

        case 5:
          userAddresses = _context3.sent;

          if (!userAddresses) {
            _context3.next = 20;
            break;
          }

          existingAddress = userAddresses.addresses.find(function (address) {
            return address.name === name;
          });

          if (!existingAddress) {
            _context3.next = 14;
            break;
          }

          console.log("Already have address with the same name");
          res.redirect("/addressAdd?error=Already have address with the same name");
          return _context3.abrupt("return");

        case 14:
          // Add a new address
          userAddresses.addresses.push({
            name: name,
            streetAddress: streetAddress,
            city: city,
            state: state,
            postalCode: postalCode,
            country: country
          });
          console.log("Adding new address:", userAddresses);
          _context3.next = 18;
          return regeneratorRuntime.awrap(userAddresses.save());

        case 18:
          _context3.next = 24;
          break;

        case 20:
          // Create a new address document for the user
          newAddress = new addressModel({
            userId: userId,
            addresses: [{
              name: name,
              streetAddress: streetAddress,
              city: city,
              state: state,
              postalCode: postalCode,
              country: country
            }]
          });
          console.log("Creating new address document:", newAddress);
          _context3.next = 24;
          return regeneratorRuntime.awrap(newAddress.save());

        case 24:
          res.redirect("/address");
          _context3.next = 31;
          break;

        case 27:
          _context3.prev = 27;
          _context3.t0 = _context3["catch"](0);
          console.log("Error redirecting AddNewAddress:", _context3.t0);
          res.render('error');

        case 31:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 27]]);
};

module.exports = AddNewAddress;
module.exports = {
  addressPage: addressPage,
  addressAddPage: addressAddPage,
  AddNewAddress: AddNewAddress
};