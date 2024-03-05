const express = require('express')
const app = express()
// const userRoute = require('./router/userRoute')
// const userRoute = require('./router/adminRoute')

app.use(express.static('public'))
app.set('view engine','ejs')
app.set('views','./views/user')
app.set('views','./views/Admin')



app.listen(8080,() =>{
    console.log("Server started")
})