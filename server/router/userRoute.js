const express = require('express')
const router = express.Router();
const userController = require("../controllers/userController");
const userCheck = require("../middleware/usermiddleware");
// const session = require('express-session');
// const bodyParser = require("body-parser");


router.get('/', userController.index);
router.get("/login", userController.login);
router.get("/signup", userController.signup);
router.post("/signup", userController.addUser);
router.post("/login", userController.checkUserIn);
router.get("/home", userCheck.isUser, userController.redirectUser);
router.get("/userDetails" ,userController.userDetails);
router.post("/logout", userController.logout);

router.get('/otpPage',userController.otpPage)
router.post('/otpPage',userController.sentOtp)



module.exports = router;
