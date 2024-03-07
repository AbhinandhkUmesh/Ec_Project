const express = require('express');
const router = express.Router();
const session = require('express-session');
const bodyParser = require("body-parser");
const userController = require("../controllers/userController");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
});

router.use(session({
    secret: "Nothing",
    resave: false,
    saveUninitialized: true
}));

router.get('/', (req, res) => {
    res.render('index',{ isAuth: req.session.isAuth });
});

router.get('/login', (req, res) => {
    if (req.session.isAuth) {
        res.redirect('/index');
    } else {
        res.render('userlogin',{ isAuth: req.session.isAuth });
    }
});

router.post("/login",userController.checkUserIn);

router.get('/index', (req, res) => {
    if (req.session.isAuth) {
        console.log(req.session.isAuth)
        res.render('index',{ isAuth: req.session.isAuth });
    } else {
        res.redirect('/login');
    }
});

router.get("/userLogout",userController.userExit);

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post("/signup",userController.addUser);

module.exports = router;
