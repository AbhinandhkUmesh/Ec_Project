const addressModel = require('../models/addressmodel');
const userModel = require('../models/usermodel');


const addressPage = async (req, res) => {
    try {
        const email = req.session.email;
        const userProfile = await userModel.findOne({ email: email });

        const addressData = await addressModel.find({ userID: req.session.userID });

        if (req.session.isUser) {
            res.render('addressPage', {
                userProfile,
                addressData,
                isUser: req.session.isUser,
                Username: req.session.Username,
            });
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        console.log("Error rendering AddressPage: " + error);
        res.render('error');
    }
};


const addressAddPage = async (req, res) => {
    try {
        const userEmail = req.session.email;
        const userProfile = await userModel.findOne({
            email: userEmail
        });

        if (req.session.isUser) {
            res.render('AddressAdd', {
                userProfile,
                
                isUser: req.session.isUser,
                Username: req.session.Username,
                error: req.query.error
            });

        } else {
            res.redirect('/login');
        }


    } catch (error) {
        console.log("Error redirecting addressAddPage: " + error);
        res.render('error');
    }
};
const AddNewAddress = async (req, res) => {
    try {
        const userId = req.session.userId;
        const { name, streetAddress, city, state, postalCode, country } = req.body;

        // Check if the user already has the specified address
        const userAddresses = await addressModel.findOne({ userId: userId });

        if (userAddresses) {
            const existingAddress = userAddresses.addresses.find(address => address.name === name);

            if (existingAddress) {
                console.log("Already have address with the same name");
                res.redirect("/addressAdd?error=Already have address with the same name")
                return;
            } else {
                // Add a new address
                userAddresses.addresses.push({
                    name,
                    streetAddress,
                    city,
                    state,
                    postalCode,
                    country
                });
                console.log("Adding new address:", userAddresses);
                await userAddresses.save();
            }
        } else {
            // Create a new address document for the user
            const newAddress = new addressModel({
                userId: userId,
                addresses: [{
                    name,
                    streetAddress,
                    city,
                    state,
                    postalCode,
                    country
                }]
            });
            console.log("Creating new address document:", newAddress);
            await newAddress.save();
        }

        res.redirect("/address");
    } catch (error) {
        console.log("Error redirecting AddNewAddress:", error);
        res.render('error');
    }
};

module.exports = AddNewAddress;


module.exports = {
    addressPage,
    addressAddPage,
    AddNewAddress
} 