const categoryModel = require('../models/categorymodel')

const productModel = require('../models/productmodel');

const showCategory = async (req, res) => {
    try {
        const listData = await categoryModel.find({}).sort({
            _id: -1
        });

        res.render("categories", {
            listData,
            Username: req.session.username,
        });


    } catch (error) {
        console.log("Admin Dashboard error: " + error);
    }
}
const addCategoryPage = async (req, res) => {
    try {
        console.log("entry 1")
        res.render('addCategoryPage', {
            Username: req.session.username
        })
        console.log("ADMIN WILL ADD CATEGORY");

    } catch (error) {
        console.error("Error while redirecting the page to add product: ", + error);
        res.status(500).send("Error occurred");
    }
}
const addCategory = async (req, res) => {
    try {
        const {
            category,
            offer
        } = req.body

        console.log("Category added " + category)


        // Finding category by name ignoring case
        const categoryFound = await categoryModel.findOne({
            name: {
                $regex: new RegExp(category, "i")
            },
        });
        console.log(categoryFound);

        if (categoryFound) {
            return res.redirect("/admin/category?err=Category already exists");
        } else {
            if (category) {
                // Creating a new category document
                const categorydata = new categoryModel({
                    category: category,
                    list: 0,
                    offer: offer,
                });

                // Saving the new category document
                await categorydata.save();
               
                return res.redirect("/admin/categorylist");
            } else {
                console.log("Error in addCategory: category is not provided!");
            }
        }
    } catch (error) {
        console.log("Error while Admin showing user data: " + error);
    }
}



module.exports = {
    showCategory,
    addCategory,
    addCategoryPage
}