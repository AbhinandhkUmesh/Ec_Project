const cartModel = require('../models/cartmodel');
const Product = require('../models/productmodel');
const { ObjectId } = require('mongoose').Types;

const cartpage = async (req, res) => {
    try {
        const userId = req.session.userId;
        let cart = await cartModel.findOne({ userId }).populate('items.productId');

        res.render('shoppingCart', {
            isUser: req.session.isUser,
            cart: cart
        });
    } catch (error) {
        console.error("Error in cartpage:", error);
        res.render('error');
    }
};

const addToCart = async (req, res) => {
    try {
        const userId = req.session.userId;
        const { color, size, quantity } = req.body;
        const productId = req.params.productId;

        let cart = await cartModel.findOne({ userId });
        if (!cart) {
            cart = new cartModel({ userId, cartTotal: 0, items: [] });
        }

        const existingItem = cart.items.find(item =>
            item.productId.toString() === productId &&
            item.color === color &&
            item.size === size
        );

        const product = await Product.findById(productId);
        const productVariant = product.properties.find(item => item.color === color && item.size === size);

        if (!product || !productVariant) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (productVariant.stockQuantity < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        if (existingItem) {
            existingItem.quantity += parseInt(quantity, 10);
            existingItem.productTotal = existingItem.quantity * product.rate;
        } else {
            const newItem = {
                productId: new ObjectId(productId),
                color,
                size,
                quantity: parseInt(quantity, 10),
                productTotal: parseInt(quantity, 10) * product.rate
            };
            cart.items.push(newItem);
        }

        productVariant.stockQuantity -= parseInt(quantity, 10);

        cart.cartTotal = cart.items.reduce((total, item) => total + item.productTotal, 0);

        await product.save();
        await cart.save();

        res.status(200).json({ message: 'Item added to cart successfully', cart });
    } catch (error) {
        console.log("Error in add to cart", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateCartItem = async (req, res) => {
    try {
        const userId = req.session.userId;
        const productId = req.params.productId;
        const { quantity } = req.body;

        let cart = await cartModel.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const item = cart.items.find(item => item.productId.toString() === productId);

        if (!item) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        const product = await Product.findById(productId);
        const productVariant = product.properties.find(variant => variant.color === item.color && variant.size === item.size);

        if (!product || !productVariant) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (quantity > item.quantity) {
            const increment = quantity - item.quantity;
            if (productVariant.stockQuantity < increment) {
                return res.status(400).json({ message: 'Insufficient stock' });
            }
            productVariant.stockQuantity -= increment;
        } else {
            const decrement = item.quantity - quantity;
            productVariant.stockQuantity += decrement;
        }

        item.quantity = parseInt(quantity, 10);
        item.productTotal = item.quantity * product.rate;
        cart.cartTotal = cart.items.reduce((total, item) => total + item.productTotal, 0);

        await product.save();
        await cart.save();

        res.status(200).json({
            productTotal: item.productTotal,
            cartTotal: cart.cartTotal,
            stockQuantity: productVariant.stockQuantity
        });
    } catch (error) {
        console.log('Error updating cart item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.session.userId;

        let cart = await cartModel.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        const item = cart.items[itemIndex];
        const product = await Product.findById(productId);
        const productVariant = product.properties.find(variant => variant.color === item.color && variant.size === item.size);

        if (!productVariant) {
            return res.status(404).json({ message: 'Product variant not found' });
        }

        productVariant.stockQuantity += item.quantity;

        cart.items.splice(itemIndex, 1);
        cart.cartTotal = cart.items.reduce((total, item) => total + item.productTotal, 0);

        await product.save();
        await cart.save();

        res.json({ cartTotal: cart.cartTotal });
    } catch (error) {
        console.error('Error deleting cart item:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    cartpage,
    addToCart,
    updateCartItem,
    deleteCartItem
};
