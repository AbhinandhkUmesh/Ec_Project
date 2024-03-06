const express = require('express')
const app = express()
const userRoute = require('./router/userRoute')
const adminRoute = require('./router/adminRoute')

app.use(express.static('public'))
app.set('view engine','ejs')
app.set('views','./views/user')
app.set('views','./views/Admin')


app.use('/',userRoute)
app.use('/admin',adminRoute)

app.listen(8080,() =>{
    console.log("Server started")
})