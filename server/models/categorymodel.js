const mongoose = require('mongoose')


const categorySchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
    list: {
        type: Number,
        required: true,
    },
    offer: {
        type: Number,
    },
    status:{
        type:Boolean,
        default: true ,
        require:true
    }

});

const category = new mongoose.model('category', categorySchema)
module.exports = category