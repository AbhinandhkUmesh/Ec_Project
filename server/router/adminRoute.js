const express = require('express')
const adminController = require("../controllers/adminController")
const adminCheck = require("../middleware/adminmiddleware")
const multer = require("../middleware/multer")
const productController = require("../controllers/productController")
const categoryControl = require('../controllers/categoryController')
const router = express.Router();



router.use(function (req,res,next){
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next()
})


router.get("/",adminController.adminLogin);         //GET request to check if user is logged in or not
router.post("/dashboard",adminController.adminDashboard);    //POST request for dashboard page
router.get("/dashboard",adminCheck.isAdmin,adminController.toDashboard);   //redirects to the dashboard page after successful login
router.get("/adminlogout",adminController.adminlogout);      //GET request to log out the user from the account


router.get("/categorylist", adminCheck.isAdmin,categoryControl.showCategory)// add category page
router.get("/addCategoryPage", adminCheck.isAdmin,categoryControl.addCategoryPage)// add category page
router.post("/addcategory", adminCheck.isAdmin,categoryControl.addCategory)// add new Category
// category edit
 //list or unlist category


router.get("/productmanagement", adminCheck.isAdmin,productController.adminProduct);// show  products
router.get("/NewProduct", adminCheck.isAdmin,productController.NewProduct); //admin add products
router.post("/addProduct", adminCheck.isAdmin, multer.array("image", 4),productController.AddProduct); // go to the add product page
router.get("/ProductStatus/:id", adminCheck.isAdmin, productController.ProductStatus);




router.get("/userManagement", adminCheck.isAdmin, adminController.adminShowUsers);
router.get("/userManagement/users", adminCheck.isAdmin, adminController.getUsersPage);
router.get("/userStatus/:id", adminCheck.isAdmin, adminController.userStatus);


router.get("/logout", adminController.logout);

module.exports = router