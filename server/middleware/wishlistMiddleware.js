const Wishlist = require('../models/wishlistmodel');

// Wishlist middleware function
const fetchWishlist = async (req, res, next) => {
    try {
        // Fetch wishlist data for the logged-in user
        const userId = req.session.userId;
        if (!userId) {
            return next(); // Proceed to next middleware if user is not logged in
        }

        const wishlistProduct = await Wishlist.findOne({ user: userId }).populate('product');
        const wishlistItems = wishlistProduct?.product || [];// Attach wishlist data to request object
        const wishlistCount = wishlistItems.length;

        res.locals.wishlist = wishlistItems;
        res.locals.wishlistCount = wishlistCount;

        next(); // Proceed to next middleware or route handler
    } catch (error) { dw
        console.error('Error fetching wishlist:', error);
        next(error); // Pass error to error handling middleware
    }
};




module.exports = {
 fetchWishlist
}