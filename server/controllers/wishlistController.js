const Wishlist = require('../models/wishlistmodel');
const Product = require('../models/productmodel');
const Cart = require('../models/cartmodel'); // Assuming you have a cart model
const { ObjectId } = require('mongoose').Types;

const addToWishlist = async (req, res) => {
    try {
        const userId = req.session.userId; // Assuming user ID is stored in session
        const productId = req.params.productId;

        if (!userId || !productId) {
            return res.status(400).json({ error: 'Invalid request' });
        }

        const userIdObj = new ObjectId(userId);
        const productIdObj = new ObjectId(productId);

        await Product.updateOne({ _id: productIdObj }, { wishlist: true });

        const wishlist = await Wishlist.updateOne(
            { user: userIdObj },
            { $addToSet: { product: productIdObj } },
            { upsert: true }
        );

        res.json({ success: true });
    } catch (err) {
        console.error('Error adding product to wishlist:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.session.userId; // Assuming user ID is stored in session
        const productId = req.params.productId;

        if (!userId || !productId) {
            return res.status(400).json({ error: 'Invalid request' });
        }

        const userIdObj = new ObjectId(userId);
        const productIdObj = new ObjectId(productId);

        await Product.updateOne({ _id: productIdObj }, { wishlist: false });

        const wishlist = await Wishlist.updateOne(
            { user: userIdObj },
            { $pull: { product: productIdObj } }
        );

        res.json({ success: true });
    } catch (err) {
        console.error('Error removing product from wishlist:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    addToWishlist,
    removeFromWishlist,   
};
