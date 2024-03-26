const productModel = require('../models/productmodel');
const userDetails = require("../models/userModel");
const multer = require("multer");
const adminProduct = async (req, res) => {
    try {
        let products = await productModel.find({}).sort({
            _id: -1
        }); // Find all products and sort by _id in descending order
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

const PdAddForm = async (req, res) => {
    try {
        res.render('PdAddForm', {
            Username: req.session.Username
        })
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send("Error occurred");
    }
}

const AddProduct = async (req, res) => {
    try {
        console.log("Check 1")
        const Prductdetails = req.body
        const imageData = req.files
        const imagePath = []
        for(let i = 0;i<imageData.length;i++){
            imagePath[i] = imageData[i].path
                .replace()
        }
        console.log(Prductdetails)

        const Product = await productModel.findOne({ name: Prductdetails.name });
        console.log("Check 2",Product)
        if (Product) {
            console.log("Product already exist ,Update thr stock");
            req.session.error ="Product already exist ,Update thr stock";
            return res.redirect('/PdAddForm');
        }
        console.log("Check 3")
        const AddProduct = new productModel({
            name:  Prductdetails.name,
            category: Prductdetails.category,
            rate:Prductdetails.rate,
            description: Prductdetails.description,
            stock:Prductdetails.stock,
            image:imagePath,
            offer:Prductdetails.offer,
            discountAmount:Prductdetails.discountAmount,
            catOffer:Prductdetails.catOffer
        });
        await AddProduct.save(); 

        console.log("Check 4")
        res.redirect("/admin/productmanagement");
    
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send("Error occurred");
    }
}

module.exports = {
    adminProduct,
    PdAddForm,
    AddProduct
};  