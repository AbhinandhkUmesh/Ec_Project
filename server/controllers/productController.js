const productModel = require('../models/productmodel');
const categoryModel = require('../models/categorymodel');
const category = require('../models/categorymodel');


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
            .sort({
                _id: -1,
                name: -1
            })
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
        // console.log("Products displayed :", products);
    } catch (error) {
        console.error("Error occurred:", error);
        res.render('error'); // Render an error page if there's an error

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
            .sort({
                name: -1
            });

        res.json(products);
    } catch (error) {
        console.log("Error fetching products:", error);
        res.render('error'); // Render an error page if there's an error

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
            error: req.query.error,
        })
        console.log("ADMIN WILL ADD PRODUCT");

    } catch (error) {
        console.error("Error while redirecting the page to add product: ", +error);
        res.render('error'); // Render an error page if there's an error

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
            offer,
            discountAmount,
            catOffer,
            properties
        } = req.body;

        console.log("Received Body:", req.body.properties);

        // Handle file uploads
        if (!req.files || !req.files.length) {
            console.log("No files were uploaded.")
            return res.render('error'); // Render an error page if there's an error
        }

        // Process uploaded files
        const files = req.files;
        const images = [];
        files.forEach((file) => {
            const image = file.filename;
            images.push(image);
        });

        // Check if product already exists
        const existingProduct = await productModel.findOne({
            name
        });

        if (existingProduct) {
            return res.redirect('/admin/NewProduct?error=Product already exists, please update');
        }
 
        // Parse properties from form

        // Create new product instance
        const newProduct = new productModel({
            name,
            category,
            rate,
            description,
            image: images,
            offer,
            discountAmount,
            catOffer,
            properties// Save properties as an array of objects
        });

        // Save the new product
        await newProduct.save();

        console.log("Check 4 added Product:", newProduct);
        return res.redirect(`/admin/productmanagement?error=success`);

    } catch (error) {
        console.error("Error occurred:", error);
        return res.render('error'); // Render an error page if there's an error
    }
}


const ProductStatus = async (req, res) => {
    try {
        const ProductId = req.params.id;
        const ProductStatus = req.query.status;
        console.log("ProductStatus check1")
        let updatedStatus;
        if (ProductStatus === "true") {
            console.log("ProductStatus check2=========")
            updatedStatus = await productModel.updateOne({
                _id: new ObjectId(ProductId)
            }, {
                $set: {
                    status: false
                }
            });

        } else {
            console.log("ProductStatus check3 =========")
            console.log(ProductId)
            updatedStatus = await productModel.updateOne({
                _id: new ObjectId(ProductId)
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
        res.render('error'); // Render an error page if there's an error

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
        res.render('error'); // Render an error page if there's an error
    }
};



const productupdate = async (req, res) => {
    try {
        const productID = req.params.id
        const updateData = req.body
        console.log(req.body);
        const files = req.files
        const images = []
        files.forEach((files) => {
            const image = files.filename;

            images.push(image)
        });
        console.log("=//////////////++", req.body.properties)
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
                catOffer: updateData.catOffer,
                properties:updateData.properties
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
        res.render('error'); // Render an error page if there's an error

    }
}

const productImageDelete = async (req, res) => {
    try {
        console.log("dfbvsdbbsfb")
        const productID = req.params.id
        const imagePath = req.query.index
        console.log(imagePath)
        const imageDelete = await productModel.updateOne({
            _id: productID
        }, {
            $pull: {
                image: imagePath
            }
        })
        console.log(imageDelete)
        res.redirect(`/admin/productEdit/${productID}`);
    } catch (error) {
        console.error("Error updating product:", error);
        res.render('error'); // Render an error page if there's an error

    }
}


//=========== User Side =================

// const product = async (req, res) => {
//     try {
//         const page = +req.query.page || 1; // Current page, default to 1 if not provided
//         const totalProducts = await productModel.countDocuments({ status: true });
//         const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE); // Calculate total pages

//         const products = await productModel.find({ status: true })
//             .populate('category')
//             .skip((page - 1) * ITEMS_PER_PAGE) // Skip products based on current page
//             .limit(ITEMS_PER_PAGE); // Limit products per page

//         const categories = await categoryModel.find({});

//         res.render('product', {
//             isUser: req.session.isUser, // Example session handling, adjust as per your setup
//             products,
//             categories,
//             currentPage: page,
//             totalPages,
//             sort: '', // Default sort value
//         });
//     } catch (error) {
//         console.error('Error fetching products:', error);
//         res.status(500).json({ message: 'Error fetching products.' });
//     }
// };



// const categoryProduct = async (req, res) => {
//     try {
//         const categoryId = req.params.categoryId;
//         const page = +req.query.page || 1; // Current page, default to 1 if not provided
//         const totalProducts = await productModel.countDocuments({ status: true, category: categoryId });
//         const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE); // Calculate total pages

//         const products = await productModel.find({ status: true, category: categoryId })
//             .populate('category')
//             .skip((page - 1) * ITEMS_PER_PAGE) // Skip products based on current page
//             .limit(ITEMS_PER_PAGE); // Limit products per page

//         const categories = await categoryModel.find({});

//         res.render('product', {
//             isUser: req.session.isUser, // Example session handling, adjust as per your setup
//             products,
//             categories,
//             currentPage: page,
//             totalPages,
//             sort: '', // Default sort value
//         });
//     } catch (error) {
//         console.error('Error fetching products by category:', error);
//         res.status(500).json({ message: 'Error fetching products by category.' });
//     }
// };

// const getProducts = async (req, res) => {
//     try {

//         const page = +req.query.page || 1; // Current page, default to 1 if not provided
//         const totalProducts = await productModel.countDocuments({ status: true });
//         const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE); // Calculate total pages

//         const searchTerm = req.query
//         const products = await productModel.find({ status: true })
//             .populate('category')
//             .sort({ rate: 1 }) // Sort by price in ascending order
//             .skip((page - 1) * ITEMS_PER_PAGE) // Skip products based on current page
//             .limit(ITEMS_PER_PAGE); // Limit products per page

//         const categories = await categoryModel.find({});

//         res.render('product', {
//             isUser: req.session.isUser, // Example session handling, adjust as per your setup
//             products,
//             categories,
//             currentPage: page,
//             totalPages,
//             sort: 'priceLowToHigh', // Sorting identifier
//         });
//     } catch (error) {
//         console.error('Error sorting products by price (low to high):', error);
//         res.status(500).json({ message: 'Error sorting products by price (low to high).' });
//     }
// };
  
// const sortProductByPriceHighToLow = async (req, res) => {
//     try {
//         const page = +req.query.page || 1; // Current page, default to 1 if not provided
//         const totalProducts = await productModel.countDocuments({ status: true });
//         const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE); // Calculate total pages

//         const products = await productModel.find({ status: true })
//             .populate('category')
//             .sort({ rate: -1 }) // Sort by price in descending order
//             .skip((page - 1) * ITEMS_PER_PAGE) // Skip products based on current page
//             .limit(ITEMS_PER_PAGE); // Limit products per page

//         const categories = await categoryModel.find({});

//         res.render('product', {
//             isUser: req.session.isUser, // Example session handling, adjust as per your setup
//             products,
//             categories,
//             currentPage: page,
//             totalPages,
//             sort: 'priceHighToLow', // Sorting identifier
//         });
//     } catch (error) {
//         console.error('Error sorting products by price (high to low):', error);
//         res.status(500).json({ message: 'Error sorting products by price (high to low).' });
//     }
// };// Define an asynchronous function to get products

const ITEMS_PER_PAGE = 8; // Adjust as needed

const getProducts = async (req, res) => {
    try {
        const page = +req.query.page || 1;
        const sortOption = req.query.sort || 'default';
        const sortDirection = req.query.direction === 'desc' ? -1 : 1;
        const categoryFilter = req.query.category || '';
        const minPrice = +req.query.minPrice || 0;
        const maxPrice = +req.query.maxPrice || Infinity;

        const query = {
            status: true,
            rate: { $gte: minPrice, $lte: maxPrice }
        };

        if (categoryFilter) {
            query.category = categoryFilter;
        }

        const totalProducts = await productModel.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

        const sortCriteria = {};
        if (sortOption === 'rate') {
            sortCriteria.rate = sortDirection;
        }

        const products = await productModel.find(query)
            .populate('category')
            .sort(sortCriteria)
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE);

        const categories = await categoryModel.find({});

        res.render('product', {
            isUser: req.session.isUser,
            products,
            categories,
            currentPage: page,
            totalPages,
            sortOption,
            sortDirection,
            categoryFilter,
            minPrice,
            maxPrice
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products.' });
    }
};






const productdetail = async (req, res) => {
    try {
        const productId = req.params.id;
        console.log("Product ID:", productId);

        const productData = await productModel.findOne({
            _id: productId,
            status: true
        });
        if (!productData) {
            // Product not found or unavailable
            return res.status(404).send("Product not found or unavailable.");
        }


        const categoryData = await categoryModel.findById(productData.category);
        if (!categoryData) {
            // Category not found or unavailable
            return res.status(404).send("Category not found or unavailable.");
        }

        const relatedProduct = await productModel.find({
            category: productData.category,
            status: true
        }).limit(4);
     

        res.render('productDetail', {
            isUser: req.session.isUser,
            products: productData,
            category: categoryData,
            relatedProduct: relatedProduct
        });
    } catch (error) {
        console.error("Error in productdetail:", error);
        res.render('error'); // Render an error page if there's an error

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
    getProducts,
    productdetail,

};


 
