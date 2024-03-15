const mongoose = require('mongoose')


const product = new mongoose.Schema({
    Productname:{
        type:String,
        require:true
    },
    price:{
        type:decimal,
        require:true
    },
    category:{
        type:Objectid,
        require:true
    },
    Discription:{
        type:String,
        require:true
    },
    Stock:{
        type:Number,
        require:true
    },
    image:{
        type:Object,
        require:true
    }

})

const productData =  new mongoose.model('productData',product)
module.exports = productData