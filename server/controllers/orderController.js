
const addressModel = require('../models/addressmodel');
const orderModel = require('../models/ordermodel')
const userModel = require('../models/usermodel');

const orders = async (req, res) => {
    try {
        const orderID = req.query.id;
        const userId = req.session.userId
        const userEmail = req.session.email;
        
        const userProfile = await userModel.findOne({
            email: userEmail
        });
        // Fetch the order details using the orderID
        const order = await orderModel.find({userID:userId});

        console.log(order)

        res.render('orderPage', {
            isUser: req.session.isUser,
            Username: req.session.Username,
            userProfile,
            orders: order // Pass the order details to the template
        });
    } catch (error) {
        console.error('Error in OrderConformation:', error);
        res.status(500).render('error', { message: 'An error occurred while loading the order confirmation page.' });
    }
};


module.exports = {
    orders

}