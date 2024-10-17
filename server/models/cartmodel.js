const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserData',
        require: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'productData',
            require: true
        },
        color: {
            type: String,
            required: true
        },
        size: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        },
        productTotal: {
            type: Number,
            require: true
        }
    }],
    cartTotal: {
        type: Number,
        require: true
    }

}, 
{
    strictPopulate: false
})

const cartCollection = new mongoose.model('cart', cartSchema)


module.exports = cartCollection;