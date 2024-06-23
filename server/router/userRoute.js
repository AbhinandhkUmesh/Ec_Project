const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");
const userCheck = require("../middleware/usermiddleware");
const productController = require("../controllers/productController");
const cartController = require("../controllers/CartController");
const checkOutController = require("../controllers/checkOutController");
const AddressController = require("../controllers/AddressController");
const orderController = require("../controllers/orderController");
var multer = require("../middleware/multer");
const wishlistMiddleware = require('../middleware/wishlistMiddleware');
const wishlistController = require("../controllers/wishlistController");

// Middleware to fetch wishlist data for all routes
router.use(wishlistMiddleware.fetchWishlist);

// Public routes
router.get('/', userController.index); // Home page
router.get("/login", userController.login); // Login page
router.get("/signup", userController.signupPage); // Signup page

// User authentication routes
router.post("/signup", userController.signUp); // Signup action
router.get("/otp", userController.otpPage); // OTP verification page
router.post("/verifyOTP", userController.authOTP); // OTP verification action
router.get("/regResOTP/:id", userController.resendOTP); // Resend OTP

router.post("/login", userController.checkUserIn); // Login action
router.get("/home", userCheck.isUser, userController.redirectUser); // Redirect to home after login
router.get("/logout", userController.logout); // Logout action

// Password reset routes
router.get("/forgotPassword", userController.forgotPassword); // Forgot password page
router.post("/forgotpasswordOtp", userController.forgotpasswordOtp); // Send OTP for password reset
router.get("/forgotOtpPage", userController.forgotOtpPage); // OTP page for password reset
router.post("/forgotPassVerifyOtp", userController.forgotPassVerifyOtp); // Verify OTP for password reset
router.get("/ForResOTP/:id", userController.ForgotresendOTP); // Resend OTP for password reset
router.get("/newpasswordPage", userController.newpasswordPage); // New password page
router.post("/newPassCreate", userController.newPassCreate); // Create new password

// User profile routes
router.get("/userDetails", userCheck.isUser, userController.userDetails); // User details page
router.post("/userUpdate/:id", userCheck.isUser, multer.array("image", 1), userController.userUpdate); // Update user details
router.get("/userImageDelete/:id", userCheck.isUser, multer.array("image", 1), userController.userImageDelete); // Delete user image

// Address management routes
router.get("/address", userCheck.isUser, AddressController.addressPage); // Address list page
router.get("/addressAdd", userCheck.isUser, AddressController.addressAddPage); // Add new address page
router.post("/AddNewAddress", userCheck.isUser, AddressController.AddNewAddress); // Add new address action

router.get("/addressEdit/:id", userCheck.isUser, AddressController.addressEditPage); // Edit address page
router.post("/updateAddress/:id", userCheck.isUser, AddressController.updateAddress); // Update address action
router.get("/addressDelete/:id", userCheck.isUser, AddressController.addressDelete); // Delete address action

// Password change routes
router.get("/changePassword", userCheck.isUser, userController.changePassword); // Change password page
router.post("/changePassword", userCheck.isUser, userController.changeVerify); // Change password action

// Product listing page
router.get("/product", userCheck.isUser, productController.product);

// Products by category
router.get("/product/category/:categoryid", userCheck.isUser, productController.categoryProduct);

// Sorting routes
router.get('/product/sort/priceLowToHigh', userCheck.isUser, productController.sortProductByPriceLowToHigh); // Sort products by price (low to high)
router.get('/product/sort/priceHighToLow', userCheck.isUser, productController.sortProductByPriceHighToLow); // Sort products by price (high to low)

// Product detail route
router.get("/product-detail/:id", productController.productdetail); // Product detail page

// Wishlist routes
router.put('/addwishlist/:productId', userCheck.isUser, wishlistController.addToWishlist); // Add to wishlist
router.put('/removewishlist/:productId', userCheck.isUser, wishlistController.removeFromWishlist); // Remove from wishlist

// Cart routes
router.get("/shopingcart", userCheck.isUser, cartController.cartpage); // Shopping cart page
router.post("/addToCart/:productId", userCheck.isUser, cartController.addToCart); // Add to cart
router.post('/updateCartItem/:productId', userCheck.isUser, cartController.updateCartItem); // Update cart item
router.delete('/deleteCartItem/:productId', userCheck.isUser, cartController.deleteCartItem); // Delete cart item

// Checkout routes
router.get('/proceedToCheckout', userCheck.isUser, checkOutController.checkOutPage); // Proceed to checkout page
router.get('/OrderConformation?', userCheck.isUser, checkOutController.OrderConformation); // Order confirmation page
router.post('/placeOrder', userCheck.isUser, checkOutController.placeOrder); // Place order action

// Order routes
router.get('/Order', userCheck.isUser, orderController.orders); // Orders page
router.post('/cancelOrder/:id', userCheck.isUser, orderController.orderCancel); // C`ancel order action
router.get('/orderDetails/:orderId', orderController.viewOrderDetails); // Order details page
router.post('/returnOrder/:id', orderController.orderReturn); // Return order action

module.exports = router; // Export the router
