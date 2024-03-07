const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/Ec_Store')
    .then(() => {
        console.log('Monghodb Connected Successfull')
    })

    .catch((error) => {
        console.log('Error db not connected',error)
    })

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    isAdmin:{
        type:{
            type:Number,
            require:true
        }
    }
})

const userData =  new mongoose.model('UserData',userSchema)
module.exports = userData