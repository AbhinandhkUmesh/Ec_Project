const express = require('express')
const route = express.Router()
const session = require('express-session')

route.use(session({
    secret:"Nothing",
    resave:false,
    saveUninitialized:true
}))




route.post('/',async (req,res)=> {
    const data = {
        email: req.body.email,
        password:req.body.password
    }
    const user = await userData.findOne({email:data.email})
    console.log(userdata)

    try{
        if(user.email === data.email && user.password === data.password){
            req.session.isAuth = true
            res.redirect('/Dashboard')
        }
        else{
            res.redirect('/')
        }
    }
    catch{
        console.log('error')
    }
})

route.get('/',(req,res) => {
    if(req.session.isAuth){
        res.redirect('/Dashboard')
    }else{
        res.render('adminlogin')
    }
})

route.get('/Dashboard',(req,res) => {
 
    if(req.session.isAuth){
        res.render('Dashboard')
    }else{
        res.redirect('/')
    }
})


module.exports = route