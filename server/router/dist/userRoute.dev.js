"use strict";

var express = require('express');

var router = express.Router();

var userController = require("../controllers/userController");

var userCheck = require("../middleware/usermiddleware"); // const session = require('express-session');
// const bodyParser = require("body-parser");


router.get('/', userController.index);
router.get("/login", userController.login);
router.get("/signup", userController.signupPage);
router.post("/signup", userController.signUp);
router.get("/otp", userController.otpPage);
router.post("/verifyOTP", userController.authOTP);
router.get("/regResOTP/:id", userController.resendOTP);
router.post("/login", userController.checkUserIn);
router.get("/home", userCheck.isUser, userController.redirectUser);
router.get("/userDetails", userController.userDetails);
router.get("/logout", userController.logout);
router.get("/productdetail", userController.productdetail);
router.get("/product", userController.product);
module.exports = router;