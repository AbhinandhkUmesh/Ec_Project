const express = require('express')
const route = express.Router()
const session = require('express-session')

route.use(session({
    secret:"Nothing",
    resave:false,
    saveUninitialized:true
}))


route.get('/',(req,res) => {
    res.render('adminlogin')
})



module.exports = route

