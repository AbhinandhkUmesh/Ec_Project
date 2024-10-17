const cartModel = require('../models/cartmodel')
const addressModel = require('../models/addressmodel');
const orderModel = require('../models/ordermodel')
const {
    v4: uuidv4
} = require('uuid');
const otpGenerator = require("otp-generator");
const Razorpay = require('razorpay')
const crypto = require('crypto');



// RazorPay key id and key secret


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

        res.render('checkoutAddressSelectionPage ', {
            isUser: req.session.isUser, // Assuming req.session.isUser indicates user authentication
            cart: cart,
            addresses: address.addresses
        });
    } catch (error) {
        console.error("Error in cartpage:", error);
        res.render('error'); // Render an error page if there's an error
    }
};


const payment = async (req, res) => {
    try {
        const userId = req.session.userId;
        const address = req.query.address;

        // Parse the address if it's in JSON format
        let formattedAddress = '';
        if (address) {
            try {
                const addressObj = JSON.parse(address);
                formattedAddress = `
                    ${addressObj.name},
                    ${addressObj.streetAddress},
                    ${addressObj.city}, ${addressObj.state}, ${addressObj.postalCode},
                    ${addressObj.country}
                `;
            } catch (error) {
                console.error("Error parsing address:", error);
                formattedAddress = "Invalid address format.";
            }
        }

        let cart = await cartModel.findOne({
            userId
        }).populate('items.productId');

        console.log(formattedAddress);

        res.render('paymentMethodPage', {
            isUser: req.session.isUser, // Assuming req.session.isUser indicates user authentication
            cart: cart,
            address: formattedAddress, // Use the formatted address
        });
    } catch (error) {
        console.error("Error in cartpage:", error);
        res.render('error'); // Render an error page if there's an error
    }
};





const OrderConformation = async (req, res) => {
    try {
        const orderID = req.query.id;

        // Fetch the order details using the orderID
        const order = await orderModel.findOne({
            orderID
        });

        if (!order) {
            return res.status(404).render('error', {
                message: 'Order not found.'
            });
        }

        res.render('OrderConformation', {
            isUser: req.session.isUser,
            order: order // Pass the order details to the template
        });
    } catch (error) {
        console.error('Error in OrderConformation:', error);
        res.status(500).render('error', {
            message: 'An error occurred while loading the order confirmation page.'
        });
    }
};


const placeOrder = async (req, res) => {
    try {
        const userId = req.session.userId;
        const paymentMethod = req.query.payment;
        const address = req.query.address;

        // Fetch the cart data
        const cart = await cartModel.findOne({ userId }).populate('items.productId');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty.' });
        }

        // Prepare products list
        const products = cart.items.map(item => ({
            productId: item.productId._id,
            name: item.productId.name,
            quantity: item.quantity,
            price: item.productId.price,
            color: item.color,
            size: item.size,
            Image: item.productId.image, // Use `item.productId.image` if this field exists in your model
            Product_total: item.price * item.quantity // Compute total price for each product
        }));

        const totalOrderValue = cart.cartTotal;
        const orderId = otpGenerator.generate(6, {
            digits: true,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });

        // Create a new order
        const newOrder = new orderModel({
            userID: userId,
            orderID: orderId,
            customerName:address.name,
            products: products,
            totalOrderValue: totalOrderValue,
            address: JSON.parse(address),
            date: new Date(),
            paymentMethod: paymentMethod,
            status: 'Pending',
            cancel: 'No'
        });

        // Save the order and update cart
        await newOrder.save();
        await cartModel.updateOne({ userId }, { $set: { items: [], cartTotal: 0 } });

        // Send response with order ID
        res.status(200).json({ orderID: newOrder.orderID });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'An error occurred while placing the order. Please try again later.' });
    }
};


const verifyRazorpayPayment = async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
        const secret = 'ZHHwWxudD39Oq9gfu2KrDEcP'; // Replace with your Razorpay secret

        // Generate the signature
        const generated_signature = crypto.createHmac('sha256', secret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        // Compare signatures
        if (generated_signature !== razorpay_signature) {
            console.error('Signature mismatch:', {
                generated_signature,
                razorpay_signature
            });
            return res.status(400).json({ result: 'failure', message: 'Payment verification failed' });
        }

        // Handle address
        const address = req.query.address;
        if (!address) {
            console.error('Address missing in query params');
            return res.status(400).json({ result: 'failure', message: 'Address is required' });
        }

        // Ensure you are parsing JSON correctly if address is a JSON string
        let parsedAddress;
        try {
            parsedAddress = JSON.parse(address);
        } catch (parseError) {
            console.error('Error parsing address:', parseError);
            return res.status(400).json({ result: 'failure', message: 'Invalid address format' });
        }

        // Fetch the cart data
        const userId = req.session.userId;
        const cart = await cartModel.findOne({ userId }).populate('items.productId');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty.' });
        }

        // Prepare products list
        const products = cart.items.map(item => ({
            productId: item.productId._id,
            name: item.productId.name,
            quantity: item.quantity,
            price: item.productId.price,
            color: item.color,
            size: item.size,
            Image: item.productId.image,
            Product_total: item.price * item.quantity
        }));

        const totalOrderValue = cart.cartTotal;
        const orderId = otpGenerator.generate(6, {
            digits: true,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });

        // Create a new order
        const newOrder = new orderModel({
            userID: userId,
            orderID: orderId,
            customerName:JSON.parse(address.name),
            products: products,
            totalOrderValue: totalOrderValue,
            address:JSON.parse(address), // Use parsed address
            date: new Date(),
            paymentMethod: 'RazorPay',
            status: 'Pending',
            cancel: 'No'
        });

        // Save the order and update cart
        await newOrder.save();
        await cartModel.updateOne({ userId }, { $set: { items: [], cartTotal: 0 } });

        // Send response with order ID
        res.status(200).json({ result: 'success', orderId: newOrder.orderID });
    } catch (error) {
        console.error('Error verifying payment and placing order:', error);
        res.status(500).json({ result: 'failure', message: 'An error occurred while placing the order. Please try again later.' });
    }
};

const placeOrderFailed = async (req, res) => {
    try {
        const paymentMethod = req.query.payment;
        const address = req.query.address;

        const cartData = await cartModel.findOne({ userId: req.session.userId }).populate('items.productId');
        if (!cartData) {
            return res.status(400).json({ message: 'Cart is empty or not found.' });
        }

        const orderId = otpGenerator.generate(16, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false
        });

        const productData = cartData.items.map(item => ({
            productId: item.productId._id,
            name: item.productId.name,
            quantity: item.quantity,
            price: item.productId.price,
            color: item.color,
            size: item.size,
            Image: item.productId.image, // Use `item.productId.image` if this field exists in your model
            Product_total: item.price * item.quantity, // Compute total price for each product
            status: "Pending",
            cancel: false,
            returnReason: null
        }));

        const discountPrice = req.session.finalPrice ? cartData.cartTotal - req.session.finalPrice : 0;

        const newOrder = new orderModel({
            userID: req.session.userId,
            orderID: orderId,
            customerName: JSON.parse(address.name),
            totalOrderValue: req.session.finalPrice || cartData.cartTotal,
            discount: discountPrice,
            address: address,
            paymentMethod: paymentMethod,
            date: new Date(),
            products: productData,
            status: "Payment Failed"
        });

        await newOrder.save();

        await cartModel.deleteOne({ userId: req.session.userId });

        // Clear session variables
        req.session.finalPrice = null;
        req.session.couponCode = null;

        res.json({ result: 'success', orderId: orderId });
    } catch (error) {
        console.error('Error in placeOrderFailed:', error);
        res.redirect('/userError');
    }
};


module.exports = {
    checkOutPage,
    payment,
    OrderConformation,
    placeOrder,
    verifyRazorpayPayment,
    placeOrderFailed,

}