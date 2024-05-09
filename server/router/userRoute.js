const express = require('express')
const router = express.Router();
const userController = require("../controllers/userController");
const userCheck = require("../middleware/usermiddleware");
const productController = require("../controllers/productController")
const cartController = require("../controllers/CartController")
var multer = require("../middleware/multer");
const wishlistMiddleware = require('../middleware/wishlistMiddleware')

// router.use(wishlistMiddleware.fetchWishlistData);
const wishlistController = require("../controllers/wishlistController")
// const session = require('express-session');
// const bodyParser = require("body-parser");
router.use(wishlistMiddleware.fetchWishlist)

router.get('/', userController.index);
router.get("/login", userController.login);
router.get("/signup", userController.signupPage);


router.post("/signup", userController.signUp);
router.get("/otp", userController.otpPage);
router.post("/verifyOTP", userController.authOTP);
router.get("/regResOTP/:id", userController.resendOTP);
router.post("/login", userController.checkUserIn);

router.get("/home", userCheck.isUser, userController.redirectUser);
router.get("/logout", userController.logout);

router.get("/forgotPassword", userController.forgotPassword);
router.post("/forgotpasswordOtp", userController.forgotpasswordOtp);
router.get("/forgotOtpPage", userController.forgotOtpPage);
router.post("/forgotPassVerifyOtp", userController.forgotPassVerifyOtp);
router.get("/ForResOTP/:id", userController.ForgotresendOTP);
router.get("/newpasswordPage", userController.newpasswordPage);
router.post("/newPassCreate", userController.newPassCreate);


router.get("/userDetails" , userCheck.isUser,userController.userDetails);
router.post("/userUpdate/:id", userCheck.isUser, multer.array("image", 1), userController.userUpdate);
router.get("/userImageDelete/:id", userCheck.isUser, multer.array("image", 1), userController.userImageDelete);


router.get("/changePassword",userCheck.isUser, userController.changePassword);
router.post("/changePassword",userCheck.isUser,userController.changeVerify);
// router.post("/changeOtpPage", userController.changeOtpPage);

router.get("/product", productController.product);
router.get("/product-detail/:id", productController.productdetail);


router.put('/addwishlist/:productId', wishlistController.addToWishlist);
router.put('/removewishlist/:productId', wishlistController.removeFromWishlist);



router.get("/shopingcart", cartController.cartpage);


module.exports = router;
