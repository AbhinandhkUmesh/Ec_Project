"use strict";

var express = require('express');

var app = express();

var bodyParser = require('body-parser');

var session = require('express-session');

var passport = require('passport');

var userRoute = require('./server/router/userRoute');

var adminRoute = require('./server/router/adminRoute');

var authController = require('./server/controllers/authcontroller');

var path = require('path');

require("dotenv").config(); // Middleware


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express["static"]('public'));
app.use(express["static"]('upload'));
app.use(session({
  secret: '12345',
  resave: false,
  saveUninitialized: true
}));

require('./auth');

app.use(passport.initialize());
app.use(function (req, res, next) {
  res.header("Cache-Control", "private,no-cache,no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
}); // Set view engine and views directory

app.set('view engine', 'ejs');
app.set('views', [path.join(__dirname, 'views/user'), path.join(__dirname, 'views/Admin')]); // Routes

app.use('/', userRoute);
app.use('/admin', adminRoute);
app.use('/auth', authController); // Start server

app.listen(process.env.APP_PORT, function () {
  console.log("Server started ", process.env.BASE_URL);
});