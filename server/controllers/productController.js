const productModel = require('../models/productmodel');



const adminProduct = async (req, res) => {
    try {
        let products = await productModel.find({}).sort({
            _id: -1
        }); // Find all products and sort by _id in descending order
        
        if (req.session.prodData) {
            products = req.session.prodData; // If session data exists, use it instead
        }

        // Render the view with the retrieved products
        res.render("productManagement", {
            Username: req.session.Username,
            Products: products,
             // Pass products array to the view
        });
        console.log( "product displayed :",products);
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send("Error occurred");
    }
};


const NewProduct = async (req, res) => {
    try {
        console.log("entry 1")
        res.render('PdAddForm', {
            Username: req.session.Username
        })
        console.log("ADMIN WILL ADD PRODUCT");

    } catch (error) {
        console.error("Error while redirecting the page to add product: ", + error);
        res.status(500).send("Error occurred");
    }
}

const AddProduct = async (req, res) => {
    try {
        console.log("Check 1 Adding product")
        const {
            name,
            category,
            rate,
            description,
            stock,
            offer,
            discountAmount,
            catOffer
        } = req.body;

        // Check if files were uploaded
        if (!req.files || !req.files.length) {
            console.log("No files were uploaded.")
            return res.status(400).send("No files were uploaded.");
            
        }
        // Extract image data from request
        const imageData = req.files
        console.log(imageData)
        console.log("Name: "+name+
        " Category: "+category+
        " rate: "+rate )

        // Extract image paths
        const imagePaths = [];
        for (let i = 0; i < imageData.length; i++) {
            imagePaths.push(imageData[i].path
                .replace(/\\/g, "/")
                .replace("public", "")
                .replace("/admin", "../"));
        }
        console.log("imagePath: ",imagePaths)

        // Check if product already exists
        const existingProduct = await productModel.findOne({
            name
        }); 

        if (existingProduct) {
            req.session.error = "Product already exists, please update its stock";
            return res.redirect('/admin/NewProduct');
        }

        console.log("Check 3")

        // Create new product instance
        const newProduct = new productModel({
            name,
            category,
            rate,
            description,
            stock,
            image: imagePaths, // Assuming 'images' is the field in your schema to store image paths
            offer,
            discountAmount,
            catOffer
        });        

        // Save the new product
        await newProduct.save();

        console.log("Check 4 added Product:", newProduct)
        return res.redirect(`/admin/productmanagement?error=success`);

    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send("Error occurred");
    }
}

module.exports = {
    adminProduct,
    NewProduct,
    AddProduct
};