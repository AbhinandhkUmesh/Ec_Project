const productModel = require('../models/productmodel');

const adminProduct = async (req, res) => {
    try {
        let products = await productModel.find({}).sort({_id: -1}); // Find all products and sort by _id in descending order
        if (req.session.prodData) {
            products = req.session.prodData; // If session data exists, use it instead
        }
        res.render("productManagement", {
            Username: req.session.Username,
            Products: products // Pass products array to the view
        });
        console.log(products, "product console");
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send("Error occurred");
    }
};

module.exports = {
    adminProduct
};
