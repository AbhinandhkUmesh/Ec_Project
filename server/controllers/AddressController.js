const addressModel = require('../models/addressmodel');
const userModel = require('../models/usermodel');


const addressPage = async (req, res) => {
    try {
        const email = req.session.email;
        const userProfile = await userModel.findOne({
            email: email
        });
        const userId = req.session.userId;

        const addressData = await addressModel.findOne({
            userId: userId
        }) 
        console.log(addressData)


        if (req.session.isUser) {
            res.render('addressPage', {
                userProfile,
                addressData: addressData,
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
        const {
            name,
            streetAddress,
            city,
            state,
            postalCode,
            country
        } = req.body;

        // Check if the user already has the specified address
        const userAddresses = await addressModel.findOne({
            userId: userId
        });

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


const addressEditPage = async (req, res) => {
    try {
        const addressId = req.params.id;
        const userId = req.session.userId;

        // Fetch user profile
        const userProfile = await userModel.findOne({
            _id: userId
        });
        if (!userProfile) {
            return res.status(404).send('User not found');
        }

        // Fetch address data
        const addressData = await addressModel.findOne({
            userId: userId
        });
        if (!addressData) {
            return res.status(404).send('Address data not found');
        }

        // Find the specific address
        const address = addressData.addresses.find(address => address._id.toString() === addressId);
        if (!address) {
            return res.status(404).send('Address not found');
        }

        // Render the edit address page
        res.render('AddressEdit', {
            userProfile,
            isUser: req.session.isUser,
            Username: req.session.Username,
            address: address
        });

        // Log the address for debugging purposes
        console.log(address);
    } catch (error) {
        console.error('Error fetching address:', error);
        res.status(500).send('Internal Server Error');
    }
};



const updateAddress = async (req, res) => {
    const addressId = req.params.id
    const userId = req.session.userId;
    const newAddress = req.body

  
    const addressData = await addressModel.findOne({
        userId: userId
    });
    if (!addressData) {
        return res.status(404).send('Address data not found');
    }

    const address = addressData.addresses.find(address => address._id.toString() === addressId);
    if (!address) {
        return res.status(404).send('Address not found');
    }

    address.name = newAddress.name
    address.streetAddress = newAddress.streetAddress
    address.city = newAddress.city
    address.state = newAddress.state
    address.postalCode = newAddress.postalCode
    address.country = newAddress.country

    await addressData.save()

    res.redirect('/address')
}


const addressDelete = async (req,res) => {
    try {
        const addressId = req.params.id
        const userId = req.session.userId;

        const addressData = await addressModel.findOne({
            userId: userId
        });
        if (!addressData) {
            return res.status(404).send('Address data not found');
        }
    
        const address = addressData.addresses.find(address => address._id.toString() === addressId);
        if (!address) {
            return res.status(404).send('Address not found');
        }

        addressData.addresses.splice(address,1)

        await addressData.save()

        res.redirect('/address')

    } catch (error) {
        
    }
}

module.exports = {
    addressPage,
    addressAddPage,
    AddNewAddress,

    addressEditPage,
    updateAddress,
    addressDelete
}