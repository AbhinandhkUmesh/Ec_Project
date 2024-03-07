const express = require('express')
const app = express()
const userRoute = require('./router/userRoute')
const adminRoute = require('./router/adminRoute')
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))
app.set('view engine','ejs')

app.use('/',userRoute)
app.set('views','./views/user')

// app.use('/admin',adminRoute) 
// app.set('views','./views/Admin')

app.listen(8080,() =>{
    console.log("Server started")
})