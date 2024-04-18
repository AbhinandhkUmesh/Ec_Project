const express = require('express')
const router = express.Router();
const userController = require("../controllers/userController");
const userCheck = require("../middleware/usermiddleware");
const productController = require("../controllers/productController")
// const session = require('express-session');
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
router.get("/userDetails" , userCheck.isUser,userController.userDetails);
router.get("/logout", userController.logout);

router.get("/product", productController.product);
router.get("/product-detail/:id", productController.productdetail);


module.exports = router;
