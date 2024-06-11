const cartModel = require('../models/cartmodel')
const addressModel = require('../models/addressmodel');
const orderModel = require('../models/ordermodel')
const { v4: uuidv4 } = require('uuid');
const otpGenerator = require("otp-generator");
const checkOutPage = async (req, res) => {
    try {
        const userId = req.session.userId;

        let cart = await cartModel.findOne({
            userId
        }).populate('items.productId')

        const address = await addressModel.findOne({
            userId: userId
        })

        console.log(address);
        const add = address.addresses;
        console.log(add)

        res.render('checkOutPage', {
            isUser: req.session.isUser, // Assuming req.session.isUser indicates user authentication
            cart: cart,
            addresses:address.addresses
        });
    } catch (error) {
        console.error("Error in cartpage:", error);
        res.render('error'); // Render an error page if there's an error
    }
};

// Ensure the path to the order model is correct

const OrderConformation = async (req, res) => {
    try {
        const orderID = req.query.id;

        // Fetch the order details using the orderID
        const order = await orderModel.findOne({ orderID });

        if (!order) {
            return res.status(404).render('error', { message: 'Order not found.' });
        }

        res.render('OrderConformation', {
            isUser: req.session.isUser,
            order: order // Pass the order details to the template
        });
    } catch (error) {
        console.error('Error in OrderConformation:', error);
        res.status(500).render('error', { message: 'An error occurred while loading the order confirmation page.' });
    }
};


const placeOrder = async (req, res) => {
    try {
        const userId = req.session.userId;
        const { address, paymentMethod } = req.body;

        const cart = await cartModel.findOne({ userId }).populate('items.productId');

        console.log("========================++++++++",cart)

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty.' });
        }

        const products = cart.items.map(item => ({
            productId: item.productId._id,
            name: item.productId.name,
            quantity: item.quantity,
            price: item.productId.price,
            color:  item.color,
            size:item.size
        }));

        const totalOrderValue = cart.cartTotal;
        const orderId = otpGenerator.generate(6, {
            digits: true,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
          });

        const newOrder = new orderModel({
            userID: userId,
            orderID: orderId,
            user: req.session.userName,
            products: products,
            totalOrderValue: totalOrderValue,
            address: JSON.parse(address),
            date: new Date(),
            status: 'Pending',
            cancel: 'No'
        });

        await newOrder.save();
        await cartModel.updateOne({ userId }, { $set: { items: [], cartTotal: 0 } });

        res.status(200).json({ orderID: newOrder.orderID }); // Send the order ID back to the client
           
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'An error occurred while placing the order. Please try again later.' });
    }
};



module.exports = {
    checkOutPage,
    OrderConformation,
    placeOrder,  
}
