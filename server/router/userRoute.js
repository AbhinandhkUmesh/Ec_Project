const express = require('express')
const router = express.Router();
const userController = require("../controllers/userController");
const userCheck = require("../middleware/usermiddleware");
// const session = require('express-session');
// const bodyParser = require("body-parser");
router.use(function (req,res,next){
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next()
})

router.get('/', userController.index);
router.get("/login", userController.login);
router.get("/signup", userController.signup);
router.post("/signup", userController.addUser);
router.post("/login", userController.checkUserIn);
router.get("/home", userCheck.isUser, userController.redirectUser);
router.get("/userDetails" ,userController.userDetails);
router.post("/logout", userController.logout);

// router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({ extended: true }));

// router.use(function (req, res, next) {
//     res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//     res.header('Expires', '-1');
//     res.header('Pragma', 'no-cache');
//     next();
// });

// router.use(session({
//     secret: "Nothing",
//     resave: false,
//     saveUninitialized: true
// }));

// router.get('/', (req, res) => {
//     res.render('index',{ isAuth: req.session.isAuth });
// });

// router.get('/login', (req, res) => {
//     if (req.session.isAuth) {
//         res.redirect('/index');
//     } else {
//         res.render('userlogin',{ isAuth: req.session.isAuth });
//     }
// });

// router.post("/login",userController.checkUserIn);

// router.get('/index', (req, res) => {
//     if (req.session.isAuth) {
//         console.log(req.session.isAuth)
//         res.render('index',{ isAuth: req.session.isAuth });
//     } else {
//         res.redirect('/login');
//     }
// });

// router.get('/userDetails', (req, res) => {
//     if (req.session.isAuth) {
//         console.log(req.session.isAuth)
//         res.render('Accountdetails',{ isAuth: req.session.isAuth });
//     } else {
//         res.redirect('/login');
//     }
// });


// router.get("/userLogout",userController.userExit);

// router.get('/signup', (req, res) => {
//     const errorMessage = req.query.message;
//     res.render('signup',{ errorMessage: errorMessage });
// });



module.exports = router;
