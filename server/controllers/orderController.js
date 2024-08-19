const orderModel = require('../models/ordermodel');
const userModel = require('../models/usermodel');
const ProductModel = require('../models/productmodel')

const orders = async (req, res) => {
    try {
        const userId = req.session.userId;
        const userEmail = req.session.email;

        const userProfile = await userModel.findOne({
            email: userEmail
        });
        const page = parseInt(req.query.page) || 1; // Current page number, default to 1
        const limit = 5; // Number of orders per page
        const skip = (page - 1) * limit; // Number of orders to skip

        const totalOrders = await orderModel.countDocuments({
            userID: userId
        });
        const totalPages = Math.ceil(totalOrders / limit);

        const orderList = await orderModel.find({
            userID: userId
        }).sort({
            date: -1
        }).skip(skip).limit(limit);

        res.render('orderPage', {
            isUser: req.session.isUser,
            Username: req.session.Username,
            userProfile,
            orders: orderList,
            totalPages,
            currentPage: page
        });
    } catch (error) {
        console.error('Error in orders:', error);
        res.status(500).render('error', {
            message: 'An error occurred while loading the orders page.'
        });
    }
};

const orderCancel = async (req, res) => {
    try {
        const orderId = req.params.id;
        const userId = req.session.userId;

        const order = await orderModel.findOne({
            _id: orderId,
            userID: userId
        }).populate('products.productId');

        if (!order) {
            return res.status(404).json({
                message: 'Order not found.'
            });
        }

        if (order.status === 'Cancelled') {
            return res.status(400).json({
                message: 'Order is already cancelled.'
            });
        }

        // Iterate over each product in the order and update its stock
        for (const item of order.products) {
            const product = await ProductModel.findById(item.productId);

            if (!product) {
                console.error(`Product with ID ${item.productId} not found.`);
                continue; // Skip if product not found
            }

            // Find the product variant matching the order item
            const productVariant = product.properties.find(variant => variant.color === item.color && variant.size === item.size);
            console.log("==========before======", productVariant.stockQuantity)
            if (productVariant) {
                // Increment stock by the quantity ordered
                productVariant.stockQuantity += item.quantity;
                await product.save();
            } else {
                console.error(`Variant not found for product ${product._id}, color: ${item.color}, size: ${item.size}`);
            }
            console.log("==========After======", productVariant.stockQuantity)

        }

        // Update order status to 'Cancelled'
        order.status = 'Cancelled';
        await order.save();

        res.status(200).json({
            message: 'Order cancelled successfully.'
        });
    }catch (error) {
        console.error('Error in orderCancel:', error);
        res.status(500).json({
            message: 'An error occurred while cancelling the order.'
        });
    }
};

const orderReturn = async (req, res) => {
    try {
        const orderId = req.params.id;
        const userId = req.session.userId;

        const order = await orderModel.findOne({
            _id: orderId,
            userID: userId
        }).populate('products.productId');

        if (!order) {
            return res.status(404).json({
                message: 'Order not found.'
            });
        }

        if (order.status !== 'Shipped') {
            return res.status(400).json({
                message: 'Order cannot be returned as it is not shipped.'
            });
        }

        // Update order status to 'Returned'
        order.status = 'Returned';
        await order.save();

        // Adjust product stock (reverse the order)
        for (const item of order.products) {
            const product = await ProductModel.findById(item.productId);

            if (!product) {
                console.error(`Product with ID ${item.productId} not found.`);
                continue; // Skip if product not found
            }

            // Find the product variant matching the order item
            const productVariant = product.properties.find(variant => variant.color === item.color && variant.size === item.size);
            
            if (productVariant) {
                // Increment stock by the quantity ordered
                productVariant.stockQuantity += item.quantity;
                await product.save();
            } else {
                console.error(`Variant not found for product ${product._id}, color: ${item.color}, size: ${item.size}`);
            }
        }

        res.status(200).json({
            message: 'Order returned successfully.'
        });
    } catch (error) {
        console.error('Error in orderReturn:', error);
        res.status(500).json({
            message: 'An error occurred while returning the order.'
        });
    }
};


const viewOrderDetails = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const userId = req.session.userId;
        const userEmail = req.session.email;

        const userProfile = await userModel.findOne({
            email: userEmail
        });

        const order = await orderModel.findById(orderId).populate('products.productId');
        if (!order) {
            return res.status(404).send('Order not found');
        }

        console.log("////////////-------", order.products);

        // Render the order details view with the order data
        res.render('orderDetails', {
            isUser: req.session.isUser,
            Username: req.session.Username,
            userProfile,
            order
        });
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).send('Server error');
    }
};



module.exports = {
    orders,
    orderCancel,
    viewOrderDetails,
    orderReturn
};