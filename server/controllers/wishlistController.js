// Import necessary modules
const Wishlist = require('../models/wishlistmodel');
const Product = require('../models/productmodel');
const { ObjectId } = require('mongoose').Types;

// Add product to wishlist
const addToWishlist = async (req, res) => {
    try {
        const userId = req.session.userId; // Assuming user ID is stored in session
        const productId = req.params.productId;

        if (!userId || !productId) {
            return res.status(400).json({ error: 'Invalid request' });
        }

        // Convert userId and productId to ObjectId
        const userIdObj = new ObjectId(userId);
        const productIdObj = new ObjectId(productId);

        // Update product's wishlist field to true
        await Product.updateOne({ _id: productIdObj }, { wishlist: true });

        // Add productId to user's wishlist
        const wishlist = await Wishlist.updateOne(
            { user: userIdObj },
            { $addToSet: { product: productIdObj } },
            { upsert: true }
        );

        console.log("Wishlist update result:", wishlist);
        res.json({ success: true });
        
    } catch (err) {
        console.error('Error adding product to wishlist:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.session.userId; // Assuming user ID is stored in session
        const productId = req.params.productId;

        if (!userId || !productId) {
            return res.status(400).json({ error: 'Invalid request' });
        }

        // Convert userId to ObjectId
        const userIdObj = new ObjectId(userId);
        const productIdObj = new ObjectId(productId);

        // Update product's wishlist field to false
        await Product.updateOne({ _id: productIdObj }, { wishlist: false });

        // Remove productId from user's wishlist
        const wishlist = await Wishlist.updateOne(
            { user: userIdObj },
            { $pull: { product: productIdObj } }
        );

        console.log("Wishlist remove result:", wishlist);
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
