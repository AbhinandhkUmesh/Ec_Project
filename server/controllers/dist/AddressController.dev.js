"use strict";

var addressModel = require('../models/addressmodel');

var userModel = require('../models/usermodel');

var addressPage = function addressPage(req, res) {
  var email, userProfile, userId, addressData;
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
          userId = req.session.userId;
          _context.next = 8;
          return regeneratorRuntime.awrap(addressModel.findOne({
            userId: userId
          }));

        case 8:
          addressData = _context.sent;
          console.log(addressData);

          if (req.session.isUser) {
            res.render('addressPage', {
              userProfile: userProfile,
              addressData: addressData,
              isUser: req.session.isUser,
              Username: req.session.Username
            });
          } else {
            res.redirect('/login');
          }

          _context.next = 17;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](0);
          console.log("Error rendering AddressPage: " + _context.t0);
          res.render('error');

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 13]]);
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

var addressEditPage = function addressEditPage(req, res) {
  var addressId, userId, userProfile, addressData, address;
  return regeneratorRuntime.async(function addressEditPage$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          addressId = req.params.id;
          userId = req.session.userId; // Fetch user profile

          _context4.next = 5;
          return regeneratorRuntime.awrap(userModel.findOne({
            _id: userId
          }));

        case 5:
          userProfile = _context4.sent;

          if (userProfile) {
            _context4.next = 8;
            break;
          }

          return _context4.abrupt("return", res.status(404).send('User not found'));

        case 8:
          _context4.next = 10;
          return regeneratorRuntime.awrap(addressModel.findOne({
            userId: userId
          }));

        case 10:
          addressData = _context4.sent;

          if (addressData) {
            _context4.next = 13;
            break;
          }

          return _context4.abrupt("return", res.status(404).send('Address data not found'));

        case 13:
          // Find the specific address
          address = addressData.addresses.find(function (address) {
            return address._id.toString() === addressId;
          });

          if (address) {
            _context4.next = 16;
            break;
          }

          return _context4.abrupt("return", res.status(404).send('Address not found'));

        case 16:
          // Render the edit address page
          res.render('AddressEdit', {
            userProfile: userProfile,
            isUser: req.session.isUser,
            Username: req.session.Username,
            address: address
          }); // Log the address for debugging purposes

          console.log(address);
          _context4.next = 24;
          break;

        case 20:
          _context4.prev = 20;
          _context4.t0 = _context4["catch"](0);
          console.error('Error fetching address:', _context4.t0);
          res.status(500).send('Internal Server Error');

        case 24:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 20]]);
};

var updateAddress = function updateAddress(req, res) {
  var addressId, userId, newAddress, addressData, address;
  return regeneratorRuntime.async(function updateAddress$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          addressId = req.params.id;
          userId = req.session.userId;
          newAddress = req.body;
          _context5.next = 5;
          return regeneratorRuntime.awrap(addressModel.findOne({
            userId: userId
          }));

        case 5:
          addressData = _context5.sent;

          if (addressData) {
            _context5.next = 8;
            break;
          }

          return _context5.abrupt("return", res.status(404).send('Address data not found'));

        case 8:
          address = addressData.addresses.find(function (address) {
            return address._id.toString() === addressId;
          });

          if (address) {
            _context5.next = 11;
            break;
          }

          return _context5.abrupt("return", res.status(404).send('Address not found'));

        case 11:
          address.name = newAddress.name;
          address.streetAddress = newAddress.streetAddress;
          address.city = newAddress.city;
          address.state = newAddress.state;
          address.postalCode = newAddress.postalCode;
          address.country = newAddress.country;
          _context5.next = 19;
          return regeneratorRuntime.awrap(addressData.save());

        case 19:
          res.redirect('/address');

        case 20:
        case "end":
          return _context5.stop();
      }
    }
  });
};

var addressDelete = function addressDelete(req, res) {
  var addressId, userId, addressData, address;
  return regeneratorRuntime.async(function addressDelete$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          addressId = req.params.id;
          userId = req.session.userId;
          _context6.next = 5;
          return regeneratorRuntime.awrap(addressModel.findOne({
            userId: userId
          }));

        case 5:
          addressData = _context6.sent;

          if (addressData) {
            _context6.next = 8;
            break;
          }

          return _context6.abrupt("return", res.status(404).send('Address data not found'));

        case 8:
          address = addressData.addresses.find(function (address) {
            return address._id.toString() === addressId;
          });

          if (address) {
            _context6.next = 11;
            break;
          }

          return _context6.abrupt("return", res.status(404).send('Address not found'));

        case 11:
          addressData.addresses.splice(address, 1);
          _context6.next = 14;
          return regeneratorRuntime.awrap(addressData.save());

        case 14:
          res.redirect('/address');
          _context6.next = 19;
          break;

        case 17:
          _context6.prev = 17;
          _context6.t0 = _context6["catch"](0);

        case 19:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 17]]);
};

module.exports = {
  addressPage: addressPage,
  addressAddPage: addressAddPage,
  AddNewAddress: AddNewAddress,
  addressEditPage: addressEditPage,
  updateAddress: updateAddress,
  addressDelete: addressDelete
};