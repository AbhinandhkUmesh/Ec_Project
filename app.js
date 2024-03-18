const express = require('express')
const app = express()
const userRoute = require('./server/router/userRoute')
const adminRoute = require('./server/router/adminRoute')
const bodyParser = require('body-parser')
const path = require('path')
const session = require('express-session');
require("dotenv").config();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))
app.set('view engine','ejs')

app.use(session({
    secret: '12345',
    resave: false,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    res.header("Cache-Control", "private,no-cache,no-store, must-revalidate");
    res.header("Expires", "-1");
    res.header("Pragma", "no-cache");
    next();
  });

app.set('views',[
    path.join(__dirname,'views/user'),
    path.join(__dirname,'views/Admin')
    ])

app.use('/',userRoute)
app.use('/admin',adminRoute) 
// app.set('views','./views/user')
// app.set('views','./views/Admin')

app.listen(8080,() =>{
    console.log("Server started")
})