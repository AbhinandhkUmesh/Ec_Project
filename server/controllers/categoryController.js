const categoryModel = require('../models/categorymodel');
const productModel = require('../models/productmodel');
const {
    ObjectId
} = require('mongoose').Types;


const showCategory = async (req, res) => {
    try {
        const page = req.query.page || 1; // Get page number from query parameters or default to 1
    const limit = 6; // Number of documents per page
    const skip = (page - 1) * limit; // Calculate the offset

    const totalcategory = await categoryModel.countDocuments({ category: 0 }); // Get total number of users

    const totalPages = Math.ceil(totalcategory / limit); // Calculate total pages

    const category = await categoryModel.find({})
                                  .sort({ category: -1 })
                                  .skip(skip)
                                  .limit(limit); // Fetch users for the current page


        // Extracting any error message from the query parameters
        req.query.err;

        res.render("categories", {
            category,
            error: req.query.error,
            Username: req.session.username,
            currentPage: page,
            totalPages
        });


    } catch (error) {
        console.log("Admin Dashboard error: " + error);
    }
}

const getCategoryPage = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; // Current page number, default to 1 if not provided
      const limit = 6; // Number of items per page
      const skip = (page - 1) * limit; // Number of items to skip based on the current page
      const category = await categoryModel.find({}).skip(skip).limit(limit).sort({ category: -1 });
      res.json(category);
    } catch (error) {
      console.log("Error fetching users:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

const addCategoryPage = async (req, res) => {
    try {
        console.log("entry 1")
        res.render('addCategoryPage', {
            Username:req.session.username,
            error:req.query.error
        })
        console.log("ADMIN WILL ADD CATEGORY");

    } catch (error) {
        console.error("Error while redirecting the page to add product: ", +error);
        res.status(500).send("Error occurred");
    }
}
const addCategory = async (req, res) => {
    try {
        const {
            category,
            offer
        } = req.body

        console.log("Category added ===" + category)


        // Finding category by name ignoring case
        const categoryFound = await categoryModel.findOne({
            category: {
                $regex: new RegExp(category, "i")
            },
        });
        console.log(categoryFound);

        if (categoryFound) {
            return res.redirect("/admin/addCategoryPage?error=Category already exists");
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

const categoryEdit = async (req, res) => {
    try {
        const categoryId = req.params.id;
      
        const categoryData = await categoryModel.findOne({_id:categoryId});
      
        res.render('categoryedit', {
            Username: req.session.Username,
            category: categoryData,
            error:req.query.error
        });

    } catch (error) {
        console.error("Error in category edit:", error);
        res.status(500).send("Internal Server Error");
    }
}

const categoryUpdate = async (req,res) => {
    try {
        const categoryId = req.params.id
        const  updateData = req.body
        console.log(req.body);

        await categoryModel.updateOne({_id:categoryId},{$set:{
            category:updateData.category,
            offer:updateData.offer
        }})
        return res.redirect("/admin/categorylist");

} catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Internal Server Error");
}
}


const categoryStatus = async (req, res) => {
    try {
        const categoryid = req.params.id;
        const categoryStatus = req.query.status;
        console.log("categoryStatus check1")
        let updatedStatus;
        if (categoryStatus === "true") {
            console.log("ProductStatus check2=========")
            updatedStatus = await categoryModel.updateOne({
                _id: new ObjectId(categoryid)
            }, {
                $set: {
                    status: false
                }
            });

        } else {
            console.log("categoryStatus check3 =========")
            console.log(categoryid)
            updatedStatus = await categoryModel.updateOne({
                _id: new ObjectId(categoryid)
            }, {
                $set: {
                    status: true
                }
            });

        }

        console.log("updatedStatus :", updatedStatus);
        console.log("categoryStatus check4 ========")
        res.redirect('/admin/categorylist');
    } catch (error) {
        console.error("Error updating user status:", error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    showCategory,
    addCategory,
    addCategoryPage,
    getCategoryPage,
    categoryEdit,
    categoryUpdate,
    categoryStatus
}