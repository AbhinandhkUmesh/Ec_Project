const cartModel = require('../models/cartmodel')
const Product = require('../models/productmodel');
const {
    ObjectId
} = require('mongoose').Types;

const cartpage = async (req, res) => {
    try {
        const userId = req.session.userId;


        let cart = await cartModel.findOne({
            userId
        }).populate('items.productId')

        console.log(cart);
        res.render('shoppingCart', {
            isUser: req.session.isUser, // Assuming req.session.isUser indicates user authentication
            cart: cart
        });
    } catch (error) {
        console.error("Error in cartpage:", error);
        res.render('error'); // Render an error page if there's an error
    }
};

const addToCart = async (req, res) => {
    try {
        const userId = req.session.userId;
        const {
            color,
            size,
            quantity
        } = req.body;
        const productId = req.params.productId;

        console.log("++++++////", productId, color, size, quantity, "/////+++++++++");

        let cart = await cartModel.findOne({
            userId
        });

        console.log("----------/////", cart);
        if (!cart) {
            // Create a new cart if user doesn't have one
            cart = new cartModel({
                userId,
                cartTotal: 0,
                items: []
            });
        }

        // Check if item already exists in the cart
        const existingItem = cart.items.find(item =>
            item.productId.toString() === productId &&
            item.color === color &&
            item.size === size
        );

        if (existingItem) {
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found'
                });
            }

            console.log("===========////", product);

            // Update quantity and product total
            const newQuantity = existingItem.quantity + parseInt(quantity, 10);
            const newProductTotal = newQuantity * product.rate;

            existingItem.quantity = newQuantity;
            existingItem.productTotal = newProductTotal;
        } else {
            // Item does not exist in cart, add it
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found'
                });
            }
            const newItem = {
                productId: new ObjectId(productId),
                color,
                size,
                quantity: parseInt(quantity, 10),
                productTotal: parseInt(quantity, 10) * product.rate // Assuming 'rate' is the product price
            };

            cart.items.push(newItem);
            console.log("=========", newItem);
        }

        cart.cartTotal = cart.items.reduce((total, item) => total + item.productTotal, 0);

        console.log("=========;;;;;", cart);
        await cart.save();

        res.status(200).json({
            message: 'Item added to cart successfully',
            cart
        });

    } catch (error) {
        console.log("Error in add to cart", error);
        res.render('error');
    }
};


const updateCartItem = async (req, res) => {
    try {
        const userId = req.session.userId;
        const productId = req.params.productId;
        const {
            quantity
        } = req.body;

        console.log("++++++++++++_____+++++", quantity);

        let cart = await cartModel.findOne({
            userId: userId
        });

        // if (!cart) {
        //     return res.status(404).json({
        //         message: 'Cart not found'
        //     });
        // }

        const item = cart.items.find(item =>
            item.productId.toString() === productId

        );
        // if (!item) {
        //     return res.status(404).json({
        //         message: 'Item not found in cart'
        //     });
        // }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        item.quantity = parseInt(quantity, 10);
        item.productTotal = item.quantity * product.rate;
        console.log("++++++++++/////+-", item.quantity, item.productTotal);
        cart.cartTotal = cart.items.reduce((total, item) => total + item.productTotal, 0);
        console.log("++++++++++", cart.cartTotal);

        res.status(200).json({
            productTotal: item.productTotal,
            cartTotal: cart.cartTotal
        });


        await cart.save();

    } catch (error) {
        console.log('Error updating cart item:', error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
};

const deleteCartItem = async (req, res) => {

    try {
        const {
            productId
        } = req.params;
        const userId = req.user._id;

        let cart = await cartModel.findOne({
            userId
        });
        if (!cart) {
            return res.status(404).json({
                message: 'Cart not found'
            });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({
                message: 'Product not found in cart'
            });
        }

        cart.items.splice(itemIndex, 1);
        cart.cartTotal = cart.items.reduce((total, item) => total + item.productTotal, 0);

        await cart.save();
        res.json({
            cartTotal: cart.cartTotal
        });
    } catch (error) {
        console.error('Error deleting cart item:', error);
        res.status(500).json({
            message: 'Server error'
        });
    }
};


module.exports = {
    cartpage,
    addToCart,
    updateCartItem,
    deleteCartItem
};