const express = require('express')
const adminController = require("../controllers/adminController")
const adminCheck = require("../middleware/adminmiddleware")
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




module.exports = router