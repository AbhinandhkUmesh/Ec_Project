"use strict";

var express = require('express');

var app = express();

var userRoute = require('./server/router/userRoute');

var adminRoute = require('./server/router/adminRoute');

var bodyParser = require('body-parser');

var path = require('path');

var session = require('express-session');

require("dotenv").config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express["static"]('public'));
app.use(express["static"]('upload'));
app.set('view engine', 'ejs');
app.use(session({
  secret: '12345',
  resave: false,
  saveUninitialized: true
}));
app.use(function (req, res, next) {
  res.header("Cache-Control", "private,no-cache,no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
});
app.set('views', [path.join(__dirname, 'views/user'), path.join(__dirname, 'views/Admin')]);
app.use('/', userRoute);
app.use('/admin', adminRoute); // app.set('views','./views/user')
// app.set('views','./views/Admin')

app.listen(process.env.APP_PORT, function () {
  console.log("Server started ", process.env.BASE_URL);
});