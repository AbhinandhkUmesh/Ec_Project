const productModel = require('../models/productmodel');
const categoryModel = require('../models/categorymodel');


const {
    ObjectId
} = require('mongoose').Types;

// Node.js route handlers
const adminProduct = async (req, res) => {
    try {
        const page = req.query.page || 1; // Get page number from query parameters or default to 1
        const limit = 6; // Number of products per page
        const skip = (page - 1) * limit; // Calculate the offset

        const totalProducts = await productModel.countDocuments({}); // Get total number of products
        const totalPages = Math.ceil(totalProducts / limit); // Calculate total pages

        const products = await productModel.find({})
            .sort({ _id: -1, name: -1 })
            .skip(skip)
            .limit(limit)
            .populate('category'); // Find all products and sort by _id in descending order

        // Render the view with the retrieved products
        res.render("productManagement", {
            Username: req.session.Username,
            products: products,
            error: req.query.error,
            currentPage: page,
            totalPages: totalPages // Pass totalPages to the view
        });
        console.log("Products displayed :", products);
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send("Error occurred");
    }
};

const getproductPage = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Current page number, default to 1 if not provided
        const limit = 6; // Number of items per page
        const skip = (page - 1) * limit; // Number of items to skip based on the current page

        const products = await productModel.find({})
            .skip(skip)
            .limit(limit)
            .sort({ name: -1 });

        res.json(products);
    } catch (error) {
        console.log("Error fetching products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const NewProduct = async (req, res) => {
    const category = await categoryModel.find({}).sort({
        name: 1
    });
    try {

        console.log("entry 1")
        res.render('PdAddForm', {
            Username: req.session.Username,
            category,
            error:req.query.error,
        })
        console.log("ADMIN WILL ADD PRODUCT");

    } catch (error) {
        console.error("Error while redirecting the page to add product: ", +error);
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
        console.log(req.body)
        // // Check if files were uploaded
        if (!req.files || !req.files.length) {
            console.log("No files were uploaded.")
            return res.status(400).send("No files were uploaded.");

        }

        console.log("Name: " + name +
            " Category: " + category +
            " rate: " + rate)

        const files = req.files
        const images = []
        files.forEach((files) => {
            const image = files.filename;

            images.push(image)
        });
        // Check if product already exists
        const existingProduct = await productModel.findOne({
            name
        });

        if (existingProduct) {
            return res.redirect('/admin/NewProduct?error=Product already exists, please update');
        }
        console.log(category, "cAT FID")


        // // Create new product instance
        const newProduct = new productModel({
            name,
            category,
            rate,
            description,
            stock,
            image: images, // Assuming 'images' is the field in your schema to store 
            offer,
            discountAmount,
            catOffer
        });

        // // Save the new product
        await newProduct.save();

        console.log("Check 4 added Product:", newProduct)
        return res.redirect(`/admin/productmanagement?error=success`);

    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send("Error occurred");
    }
}


const ProductStatus = async (req, res) => {
    try {
        const Productid = req.params.id;
        const ProductStatus = req.query.status;
        console.log("ProductStatus check1")
        let updatedStatus;
        if (ProductStatus === "true") {
            console.log("ProductStatus check2=========")
            updatedStatus = await productModel.updateOne({
                _id: new ObjectId(Productid)
            }, {
                $set: {
                    status: false
                }
            });

        } else {
            console.log("ProductStatus check3 =========")
            console.log(Productid)
            updatedStatus = await productModel.updateOne({
                _id: new ObjectId(Productid)
            }, {
                $set: {
                    status: true
                }
            });

        }

        console.log("updatedStatus :", updatedStatus);
        console.log("ProductStatus check4 ========")
        res.redirect('/admin/productmanagement');
    } catch (error) {
        console.error("Error updating user status:", error);
        res.status(500).send("Internal Server Error");
    }
};


const productEdit = async (req, res) => {
    console.log("Entered productEdit");
    try {
        const productId = req.params.id;
        console.log("===========", productId) // Corrected variable name
        const productData = await productModel.findOne({
            _id: productId
        });
        console.log("Product Data:", productData);

        const categoryData = await categoryModel.find({});
        res.render('productedit', {
            Username: req.session.Username,
            product: productData,
            category: categoryData,
        });
    } catch (error) {
        console.error("Error in Product edit:", error);
        res.status(500).send("Internal Server Error");
    }
};



const productupdate = async (req, res) => {
    try {
        const productID = req.params.id
        const updateData = req.body
        console.log(req.body);
        console.log("=++++++++", productID);
        console.log("=++++====++++", updateData);
        const files = req.files
        const images = []
        files.forEach((files) => {
            const image = files.filename;

            images.push(image)
        });
        console.log("=++++++----++", images)
        const dataUpload = await productModel.updateOne({
            _id: productID
        }, {
            $set: {
                name: updateData.name,
                category: updateData.category,
                rate: updateData.rate,
                description: updateData.description,
                stock: updateData.stock,
                offer: updateData.offer,
                discountAmount: updateData.discountAmount,
                catOffer: updateData.catOffer
            }
        })

        const imageUpload = await productModel.updateOne({
            _id: productID
        }, {
            $push: {
                image: {
                    $each: images
                }
            }
        });

        console.log(dataUpload, "----===++===---")
        console.log(imageUpload, "----======---")
        res.redirect("/admin/productmanagement");

    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).send("Internal Server Error");
    }
}

const productImageDelete = async (req, res) => {
    try {
        const productID = req.params.id
        const imagePath = req.query.index
        const imageDelete = await productModel.updateOne({
            _id: productID
        }, {
            $pull: {
                image: imagePath
            }
        })
        console.log(imageDelete)
        res.redirect(`/admin/productEdit/${productID}`);
    }catch (error) {
            console.error("Error updating product:", error);
            res.status(500).send("Internal Server Error");
        }
}



// =====User Side===========

const product = async (req, res) => {
    try {
        let products = await productModel.find({})
        const category = await categoryModel.find({})
        res.render('product', {
            isUser: req.session.isUser,
            products,
            category
            
        })
    } catch (error) {
        
    }
   
}

const productdetail = async (req, res) => {
    try {
        const productId = req.params.id;
        console.log("Product ID:", productId);

        const productData = await productModel.findOne({ _id: productId, status: true });
        if (!productData) {
            // Product not found or unavailable
            return res.status(404).send("Product not found or unavailable.");
        }

        console.log("Product Data:", productData);

        const categoryData = await categoryModel.findById(productData.category);
        if (!categoryData) {
            // Category not found or unavailable
            return res.status(404).send("Category not found or unavailable.");
        }

        console.log("Category Data:", categoryData);

        const relatedProduct = await productModel.find({ category: productData.category, status: true }).limit(4);
        console.log("Related Products:", relatedProduct);

        res.render('productDetail', {
            isUser: req.session.isUser,
            products: productData,
            category: categoryData,
            relatedProduct: relatedProduct
        });
    } catch (error) {
        console.error("Error in productdetail:", error);
        res.status(500).send("Internal Server Error");
    }
};


module.exports = {
    // Admin
    adminProduct,
    NewProduct,
    AddProduct,
    ProductStatus,
    getproductPage,
    productEdit,
    productupdate,
    productImageDelete,

    // User
    product,
    productdetail


};