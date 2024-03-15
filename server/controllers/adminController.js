const userModel = require('../models/usermodel')
const bcrypt = require('bcrypt')



const adminLogin = async (req, res) => {
    if (req.session.isAdmin) {
        console.log("entry 1")
        res.redirect('/admin/dashboard')
    }
    else {
        console.log("rendered adminlogin")
        res.render('adminlogin',{error:req.query.error})
    }
}


const adminDashboard = async (req, res) => {
    try {
        console.log("check1")
      const email = req.body.email;
      const adminData = await userModel.findOne({ email:email });
      console.log(adminData);
      if (adminData && adminData.isAdmin == 1) {
        password = await bcrypt.compare(req.body.password, adminData.password);
        if (password) {
          req.session.isAdmin = true;
          req.session.username = adminData.Username;
          res.redirect("/admin/dashboard");
        } else {
          res.redirect("/admin?error=Invalid password");
        }
      } else {
        res.redirect("/admin?error=Not authorized");
      }
    } catch (error) {
      console.log("Admin Dashboard error: " + error);
    }
  };



const toDashboard = (req, res) => {
    try {
        res.render("Dashboard", { Username: req.session.username });
        console.log("Admin Dashboard");
    } catch (error) {
        console.log("Dashboard  Error:" + error);
    }
};

const adminlogout = (req, res) => {
    try {
        // Clear all sessions
        console.log("trying to logout")
        req.session.destroy(err => {
            if (err) {
                console.log("Error clearing sessions:", err);
                return res.status(500).send("Internal Server Error");
            }
            // Redirect to adminlogin page
            res.redirect("/admin");
        });
        console.log("admin logged out");
    } catch (error) {
        console.log("Error during user signout:", error);
        res.status(500).send("Internal Server Error");
    }
};
module.exports = {
    adminLogin,
    adminDashboard,
    toDashboard,
    adminlogout,
}