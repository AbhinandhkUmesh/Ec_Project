"use strict";

var express = require('express');

var router = express.Router();
var instance = new Razorpay({
  key_id: 'YOUR_KEY_ID',
  key_secret: 'YOUR_KEY_SECRET'
});