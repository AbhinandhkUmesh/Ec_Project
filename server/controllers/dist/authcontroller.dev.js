"use strict";

var passport = require('passport');

var express = require('express');

var router = express.Router();

var usermodel = require('../models/usermodel');

require('../../auth');

router.get('/google', passport.authenticate('google', {
  scope: ['email', 'profile']
}));
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/login'
}), function _callee(req, res) {
  var user, userData, userEmail, createdUser;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          user = req.user;
          userData = {
            Username: user.displayName,
            email: user.emails && user.emails.length > 0 ? user.emails[0].value : 'No Email',
            image: user.photos && user.photos.length > 0 ? user.photos[0].value : 'No Image'
          };
          console.log("//////////////////", user);
          _context.next = 5;
          return regeneratorRuntime.awrap(usermodel.findOne({
            email: userData.email
          }));

        case 5:
          userEmail = _context.sent;
          console.log("//////////=======", userEmail);
          _context.prev = 7;

          if (!userEmail) {
            _context.next = 14;
            break;
          }

          req.session.isUser = true;
          req.session.email = userEmail.email;
          res.redirect('/home');
          _context.next = 20;
          break;

        case 14:
          _context.next = 16;
          return regeneratorRuntime.awrap(usermodel.create(userData));

        case 16:
          createdUser = _context.sent;
          req.session.isUser = true;
          console.log(createdUser);
          res.redirect('/home');

        case 20:
          _context.next = 26;
          break;

        case 22:
          _context.prev = 22;
          _context.t0 = _context["catch"](7);
          console.error(_context.t0);
          res.status(500).send('Internal Server Error');

        case 26:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[7, 22]]);
});
module.exports = router;