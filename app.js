const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const session = require('express-session');
const passport = require('passport')
const userRoute = require('./server/router/userRoute')
const adminRoute = require('./server/router/adminRoute')
const authController = require('./server/controllers/authcontroller')
const usermodel = require('./server/models/usermodel')
const path = require('path')

require("dotenv").config();


// Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))
app.use(express.static('upload'))

app.use(session({
    secret: '12345',
    resave: false,
    saveUninitialized: true
}));

require('./auth')

app.use(passport.initialize())



app.use((req, res, next) => {
    res.header("Cache-Control", "private,no-cache,no-store, must-revalidate");
    res.header("Expires", "-1");
    res.header("Pragma", "no-cache");
    next();
  });


// Set view engine and views directory
app.set('view engine','ejs')
app.set('views',[
    path.join(__dirname,'views/user'),
    path.join(__dirname,'views/Admin')
    ])


// Routes
app.use('/',userRoute)
app.use('/admin',adminRoute) 
app.use('/auth',authController)


// Start server
app.listen(process.env.APP_PORT,() =>{
    console.log("Server started ", process.env.BASE_URL )
})