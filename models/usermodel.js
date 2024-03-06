const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/Ec_Store')
    .then(() => {
        console.log('Monghodb Connected Successfull')
    })

    .catch((error) => {
        console.log('Error db not connected',error)
    })

const schema = new mongoose.schema({
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

const userData =  new mongoose.model('UserData',schema)
module.exports = userData