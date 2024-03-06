const express = require('express')
const route = express.Router()
const session = require('express-session')
const bodyParser = require("body-parser")
const user = require("../controllers/userconroller")

route.use(bodyParser.json());
route.use(bodyParser.urlencoded({ extended: true }))

route.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next()
});

route.use(session({
    secret:"Nothing",
    resave:false,
    saveUninitialized:true
}))

route.get('/',(req,res) => {
        res.render('index')
})

route.get('/login',(req,res) => {
    if(req.session.isAuth){
        res.redirect('/index')
    }
    else{
        res.render('userlogin')
    }
})



route.get('/index',(req,res) => {
    if(req.session.isAuth){
        res.render('index')
    }
    else{
        res.redirect('/login')
    }
})

route.post("/", user.checkUserIn)


route.post("/index", user.checkUserIn)


route.post('/login',async (req,res)=> {
    

})

route.get('/index',(req,res) => {
    if(req.session.isAuth){
        res.render('index')
    }else{
        res.redirect('/login')
    }
})

route.get('/signup' , (req,res) => {
    res.render('signup')
})

// route.post('/signup',user.addUser)

module.exports = route