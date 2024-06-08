const userModel = require('../models/usermodel')
const bcrypt = require('bcrypt')
const { ObjectId } = require('mongoose').Types;
const orderModel = require('../models/ordermodel')

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
        console.log("check2")
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
      if (req.session.isAdmin) {
        res.render("Dashboard", { Username: req.session.username });
        console.log("Admin Dashboard");
      }
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

const adminShowUsers = async (req, res) => {
  try {
    const page = req.query.page || 1; // Get page number from query parameters or default to 1
    const limit = 6; // Number of documents per page
    const skip = (page - 1) * limit; // Calculate the offset

    const totalUsers = await userModel.countDocuments({ isAdmin: 0 }); // Get total number of users

    const totalPages = Math.ceil(totalUsers / limit); // Calculate total pages

    const user = await userModel.find({ isAdmin: 0 })
                                  .sort({ Username: -1 })
                                  .skip(skip)
                                  .limit(limit); // Fetch users for the current page

    res.render("userManagement", {
      Username: req.session.username,
      user,
      currentPage: page,
      totalPages
    });
    console.log("Admin View User");
  } catch (error) {
    console.log("Error while Admin showing user data: " + error);
    res.status(500).send("Internal Server Error");
  }
};

const getUsersPage = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Current page number, default to 1 if not provided
    const limit = 6; // Number of items per page
    const skip = (page - 1) * limit; // Number of items to skip based on the current page
    const users = await userModel.find({ isAdmin: 0 }).skip(skip).limit(limit).sort({ Username: -1 });
    res.json(users);
  } catch (error) {
    console.log("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const userStatus = async (req, res) => {
  const userId = req.params.id;
  const userStatus = req.query.status;

  if (!req.session.isAdmin) {
      return res.redirect('/admin');
  }

  try {
    console.log("userStatus check1")
      let updatedStatus;
      if (userStatus === "true") {
        console.log("userStatus check2")
          updatedStatus = await userModel.updateOne({ _id: new ObjectId(userId) }, { $set: { status: false } });
          req.session.isUser = false
      } else {
        console.log("userStatus check3")
          console.log(userId)
          updatedStatus = await userModel.updateOne({ _id: new ObjectId(userId) }, { $set: { status: true } });
          req.session.isUser = true
      }
      
      console.log("updatedStatus :",updatedStatus);
      console.log("userStatus check4")
      res.redirect('/admin/userManagement');
  } catch (error) {
      console.error("Error updating user status:", error);
      res.status(500).send("Internal Server Error");
  }
};

const logout = (req, res) => {
  try {
      req.session.destroy(err => {
          if (err) {
              console.log("Error clearing sessions:", err);
              return res.status(500).send("Internal Server Error");
          }
          res.redirect("/admin");
      });
      console.log("User logged out");
  } catch (error) {
      console.log("Error during user signout:", error);
      res.status(500).send("Internal Server Error");
  }
};

const adminShowOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).populate('userID')
    console.log();
    res.render('orderManagement', {
      Username: req.session.Username,
      orders: orders // Pass the order details to the template
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Display the order edit form
const adminShowOrderEditForm = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await orderModel.findById(orderId).populate('userID');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.render('orderEdit', {
      Username: req.session.username,
      order: order // Pass the order details to the template
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const adminUpdateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status, cancel } = req.body;
    
    console.log('Received data:', { status, cancel });

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    console.log('Original order:', order);

    if (status) {
      order.status = status;
    }

    order.cancel = cancel === 'true';

    const updatedOrder = await order.save();
    console.log('Updated order:', updatedOrder);

    res.redirect('/admin/UserOrders');
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
    adminLogin,
    adminDashboard,
    toDashboard,
    adminlogout,
    adminShowUsers,
    userStatus,
    getUsersPage,
    logout,
    adminShowOrders,
    adminShowOrderEditForm,
    adminUpdateOrder
}      