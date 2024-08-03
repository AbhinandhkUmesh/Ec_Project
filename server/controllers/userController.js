const userModel = require('../models/usermodel');
const bcrypt = require('bcrypt');
const Wishlist = require('../models/wishlistmodel');
const otpSend = require("../middleware/otp");
const {
    isUser
} = require('../middleware/usermiddleware');
const productModel = require('../models/productmodel');
const categoryModel = require('../models/categorymodel')
const addressModel = require('../models/addressmodel');
const wishlist = require('../models/wishlistmodel');
const { ObjectId } = require('mongoose').Types;

const index = async (req, res) => {
    try {
        const category = await categoryModel.find({})
        let products = await productModel.find({
            status: true
        }).limit(8)
        console.log("=====", products)
        if (req.session.isUser) {
            res.redirect('/home');
        
        } else {
            res.render('home', {
                isUser: req.session.isUser,
                error: req.session.error,
                wishlist: res.locals.wishlist,
                category,
                products
            });
           
        }
    } catch (error) {
        console.log("Error rendering index page: " + error);
        res.render('error');
    }
};

const login = (req, res) => {
    try {

        if (req.session.isUser) {
            res.redirect('/home');
        } else {
            res.render('userlogin', {
                isUser: req.session.isUser,
                error: req.query.error,
                wishlist: res.locals.wishlist,
            });
        }
    } catch (error) {
        console.log("Error rendering user login page: " + error);
        res.render('error');
    }
};

const signupPage = (req, res) => {
    try {

        res.render("signup", {
            isUser: req.session.isUser,
            error: req.query.error,
            wishlist: res.locals.wishlist,
        });
        console.log("User signup");
    } catch (error) {
        console.log("Error rendering user signup page: " + error);
        res.render('error');
    }
};

const signUp = async (req, res) => {
    try {
        const email = req.body.email;
        const Username = req.body.Username; // Assuming username is in req.body
        const password = req.body.password;
        const conformPassword = req.body.password;

        // const uppercaseRegex = /[A-Z]/;
        // const lowercaseRegex = /[a-z]/;
        // const numberRegex = /[0-9]/;
        // const specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

        if (email === '' && password === ''  ) {
            return res.redirect('/signup?error=Enter your details');
        } 
        // Check if email or username already exists
        const alreadyExist = await userModel.findOne({
            $or: [{
                email: email
            }, {
                Username: Username
            }]
        });



        if (alreadyExist) {
            if (alreadyExist.email === email) {
                return res.redirect('/signup?error=Email Already Exists');
            } else if (alreadyExist.Username === Username) {
                return res.redirect('/signup?error=Username Already Exists');
            }
        }
        // if (conformPassword !== password) {
        //     return res.redirect('/signup?error=Conform your password');
        // }

        // if (password.length < 6 ||
        //     !uppercaseRegex.test(password) ||
        //     !lowercaseRegex.test(password) ||
        //     !numberRegex.test(password) ||
        //     !specialCharRegex.test(password)) {
        //     return res.redirect('/signup?error=Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.');
        // }

        // Set user details in session
        req.session.userDetails = {
            email,
            Username,
            password
        };
        req.session.email = email

        // Assuming otpSend.sendmail(email) is an asynchronous function
        console.log("Sending OTP to:", email);
        const otpData = await otpSend.sendmail(email);
        console.log("OTP sent:", otpData);

        // Store OTP in session
        req.session.OTP = otpData;

        // Redirect to OTP verification page
        return res.render("otppage", {
            OTP: otpData,
            email: email,
            error: req.query.error,
            isUser: req.session.isUser,
        });

    } catch (err) {
        console.log("Error in signUp: ", err);
        res.render('error');
    }
};

const authOTP = async (req, res) => {
    try {
        const otp = req.body.otp;
        const storedOTP = req.session.OTP;
        console.log(otp, "=====1st test=====", storedOTP); // Retrieve the OTP stored in the session
        if (otp === storedOTP) { // Compare the entered OTP with the stored one
            console.log("=====2nd test=====");
            // Check if userDetails and password exist in the session
            if (!req.session.userDetails || !req.session.userDetails.password) {
                res.redirect('/signup?error=User details or password not found');
                throw new Error("User details or password not found in session.");
            }

            console.log(req.session.userDetails.password)
            // Hash the password
            const hashedPassword = await bcrypt.hash(req.session.userDetails.password, 10);
            console.log(hashedPassword)
            // Create a new user with hashed password
            const registeredUser = new userModel({
                Username: req.session.userDetails.Username,
                password: hashedPassword,
                email: req.session.email,
                status: true,
                isAdmin: 0,
            });
            console.log("=====3rd test=====");
            await registeredUser.save(); // Save the user to the database
            console.log("Registered User:", registeredUser);
            res.redirect("/login");
        } else {
            res.render("otppage", {
                email: req.session.email,
                error: "Invalid OTP entered",
                isUser: req.session.isUser
            });
        }
    } catch (err) {
        console.log("Error while authenticating OTP: " + err);
        res.render('error');
    }
};

const resendOTP = async (req, res) => {
    try {
        const email = req.session.email;
        console.log("=====Resending OTP to email:" + email);
        const otpRData = await otpSend.sendmail(email);
        console.log("===== otpResendData is ========" + otpRData);
        req.session.OTP = otpRData;
        req.session.otpTimestamp = Date.now(); // Update the timestamp
        req.session.otpError = null; // Reset OTP error
        res.redirect("/otp");
        console.log("USER RESEND OTP PAGE");
    } catch (error) {
        console.log("Error while resending OTP :" + error);
        res.render('error');
    }
};

const otpPage = (req, res) => {
    try {
        const email = req.session.userDetails.email;
        res.render('otppage', {
            isUser: req.session.isUser,
            error: req.session.otpError,
            email
        });
    } catch (error) {
        console.log("Error rendering user otp page: " + error);
        res.render('error');
    }
};


const checkUserIn = async (req, res) => {
    try {
        console.log("check 1");
        const email = req.body.email;
        const userProfile = await userModel.findOne({
            email: email
        });
        console.log(email, "check 2", userProfile);

        if (!userProfile) {
            console.log("User not found in the database.");
            req.session.error = "Not a registered user. Please register first.";
            return res.redirect('/login?error=User not found');
        } else if (!userProfile.status) {
            return res.redirect('/login?error=Your account is Blocked');
        }

        console.log(req.body.password);
        console.log(userProfile.password);


        const checkPass = await bcrypt.compare(req.body.password, userProfile.password);
        console.log(checkPass)
        if (checkPass) {
            console.log("Password checked");
            req.session.isUser = true;
            req.session.lastAccess = Date.now();
            req.session.userId = userProfile._id;
            req.session.Username = userProfile.Username;
            req.session.userDetails = userProfile
            req.session.userId = userProfile._id
            req.session.email = email;
            return res.redirect("/home");
        } else {
            console.log("Incorrect password");
            req.session.error = "Incorrect password. Please try again.";
            return res.redirect("/login?error=Incorrect password");
        }
    } catch (error) {
        console.log("Error validating user:", error);
        req.session.error = "Internal Server Error. Please try again later.";
        res.render('error');
    }
};



const redirectUser = async (req, res) => {
    try {
        const category = await categoryModel.find({})
        const products = await productModel.find({
            status: true
        }).limit(8)
        const userId = req.session.userId
        
  
     
            res.render("home", {
                isUser: req.session.isUser,
                products: products,
                category: category,
                wishlist: res.locals.wishlist,
            });
      
       
    } catch (error) {
        console.log("Error redirecting user: " + error);
        res.render('error');
    }
};

const forgotPassword = (req, res) => {
    try {
        res.render('ForgotPassword', {
            isUser: req.session.isUser,
            error: req.query.error
        });
    } catch (error) {
        console.log("Error during user forgot password:", error);
        res.render('error');
    }
};

const forgotpasswordOtp = async (req, res) => {
    try {
        const email = req.body.email;
        console.log(email)
        const UserNotExist = await userModel.findOne({
            email: email
        })
        if (!UserNotExist) {
            return res.redirect('/signup?error=Email Not Exists');
        }
        const otpData = await otpSend.sendmail(email);

        req.session.email = email
        req.session.OTP = otpData
        
        res.redirect('/forgotOtpPage')
    } catch (error) {
        console.log("Error during user forgot password:", error);
        res.render('error');
    }
};

const forgotOtpPage = async (req, res) => {
    try {
        console.log(req.session.email)
        console.log(req.session.OTP)
        res.render('ForgotOtpPage', {
            email: req.session.email,
            isUser: req.session.isUser,
            error: req.query.error
        });
    } catch (error) {
        console.log("Error during user forgot password:", error);
        res.render('error');
    }
};

const forgotPassVerifyOtp = async (req, res) => {
    try {
        const otpdata = req.session.OTP
        const otp = req.body.otp
        console.log(otpdata, "=======", otp)
        if (otpdata === otp) {
           res.redirect('/newpasswordPage')
        } else {
            res.render("ForgotOtpPage", {
                email: req.session.email,
                error: "Invalid OTP entered",
                isUser: req.session.isUser
            });
        }
    } catch (error) {
        console.log("Error during user forgot password:", error);
        res.render('error');
    }
};

const newpasswordPage = async (req,res) => {
    try {
        res.render('newpassword', {
            email: req.session.email,
            isUser: req.session.isUser,
            error: req.query.error
        });
    } catch (error) {
        console.log("Error during user forgot password:", error);
        res.render('error');
    }
}


const ForgotresendOTP = async (req, res) => {
    try {
        const email = req.session.email;
        console.log("=====Resending OTP to email:" + email);
        const otpRData = await otpSend.sendmail(email);
        console.log("===== otpResendData is ========" + otpRData);
        req.session.OTP = otpRData;
        req.session.otpTimestamp = Date.now(); // Update the timestamp
        req.session.otpError = null; // Reset OTP error
        res.redirect("/forgotOtpPage");
        console.log("USER RESEND OTP PAGE");
    } catch (error) {
        console.log("Error while resending OTP :" + error);
        res.render('error');
    }
};

const newPassCreate = async (req, res) => {
    try {
        const email = req.session.email;
        const password = req.body.password
        const conformPassword = req.body.conformPassword


        console.log(password,"=========",conformPassword)
        const uppercaseRegex = /[A-Z]/;
        const lowercaseRegex = /[a-z]/;
        const numberRegex = /[0-9]/;
        const specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

        if (password !== conformPassword) {
            res.redirect('/newpasswordPage?error = Conform password is wrong')
        }

        if (password.length < 6 ||
            !uppercaseRegex.test(password) ||
            !lowercaseRegex.test(password) ||
            !numberRegex.test(password) ||
            !specialCharRegex.test(password)) {
            return res.redirect('/newpasswordPage?error=Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const updatedUserpassword = await userModel.updateOne({
            email: email
        }, {
            $set: {
                password: hashedPassword
            }
        })
        console.log("++++++",updatedUserpassword)
        res.redirect('/login')
    } catch (error) {
        console.log("Error during user forgot password:", error);
        res.render('error');
    }
};

const changePassword = async (req, res) => {
    try {
        res.render('changepassword', {
            isUser: req.session.isUser,
            error: req.query.error
        });
    } catch (error) {
        console.log("Error during user forgot password:", error);
        res.render('error');
    }
};


const changeVerify = async (req, res) => {
    try {
        const email = req.session.email
        const newPassword = req.body.newPassword;
        const oldPassword = req.body.oldPassword;

        const uppercaseRegex = /[A-Z]/;
        const lowercaseRegex = /[a-z]/;
        const numberRegex = /[0-9]/;
        const specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
        // Check if email or username already exists
        const userProfile = await userModel.findOne({
            email: email
        });


        if (!userProfile.password === newPassword) {
            return res.redirect('/forgotPassword?error= Please Sign in User not found');
        }


        const verifyOldPassword = await bcrypt.compare(oldPassword, userProfile.password);
        const verifyNewPassword = await bcrypt.compare(newPassword, userProfile.password);

        if (!verifyOldPassword) {
            return res.redirect('/changePassword?error= Old password is wrong');
        }
        if (!verifyNewPassword) {
            return res.redirect('/changePassword?error= Old password and new Password  is same ');
        }

        if (newPassword.length < 6 ||
            !uppercaseRegex.test(password) ||
            !lowercaseRegex.test(password) ||
            !numberRegex.test(password) ||
            !specialCharRegex.test(password)) {
            return res.redirect('/changePassword?error=Password must be at least 6 characters,one uppercase letter, one lowercase letter, one number, and one special character.');
        }
        const hashedPassword = await bcrypt.hash(newPassword.toString(), 10);

        await userModel.updateOne({
            email: email
        }, {
            $set: {
                password: hashedPassword,
            }
        })
        res.redirect('/login?error=Password Changed');
    } catch (error) {
        console.log("Error during user forgot password:", error);
        res.render('error');
    }
};

const logout = (req, res) => {
    try {

        if (req.session.timeoutTimer) {
            clearTimeout(req.session.timeoutTimer)
        }
        req.session.destroy(err => {
            if (err) {
                console.log("Error clearing sessions:", err);
                return res.status(500).send("Internal Server Error");
            }
            res.redirect("/login");
        });
    } catch (error) {
        console.log("Error during user signout:", error);
        res.render('error');
    }
};



const userDetails = async (req, res) => {
    try {
        const userEmail = req.session.email;
        const userProfile = await userModel.findOne({
            email: userEmail
        });
        const addressData = await addressModel.findOne({
            email: userEmail
        });

        if (req.session.isUser) {
            res.render('userDetails', {
                userProfile,
                addressData,
                isUser: req.session.isUser,
                Username: req.session.Username,
            });

        } else {
            res.redirect('/login');
        }


    } catch (error) {
        console.log("Error redirecting UserPage: " + error);
        res.render('error');
    }
};

const userUpdate = async (req, res) => {
    try {
        const userID = req.params.id;
        const updateData = req.body;
        const data = await userModel.find({
            userID
        })
        // Get the filename from uploaded files
        if (req.files[0] == data.image) {

            const dataUpload = await userModel.updateOne({
                _id: userID
            }, {
                $set: {
                    Username: updateData.Username,
                    email: updateData.email,
                    phone: updateData.phone,

                }
            });
        } else {
            const image = req.files[0].filename;
            const dataUpload = await userModel.updateOne({
                _id: userID
            }, {
                $set: {
                    Username: updateData.Username,
                    email: updateData.email,
                    phone: updateData.phone,
                    image: image
                }
            });
        }
        // Update user data in the database

        res.redirect("/userdetails");
    } catch (error) {
        console.error("Error updating user:", error);
        res.render('error');
    }
};



const userImageDelete = async (req, res) => {
    try {
        const userID = req.params.id

        const imageDelete = await userModel.updateOne({
            _id: userID
        }, {
            $set: {
                image: ""
            }
        })
        console.log(imageDelete)
        res.redirect(`/userdetails`);
    } catch (error) {
        console.error("Error updating user:", error);
        res.render('error');
    }
}


module.exports = {
    index,
    login,
    signupPage,
    authOTP,
    otpPage,
    checkUserIn,
    redirectUser,

    forgotPassword,
    forgotpasswordOtp,
    forgotPassVerifyOtp,
    forgotOtpPage,
    newPassCreate,
    ForgotresendOTP,
    newpasswordPage,

    userDetails,
    userUpdate,
    userImageDelete,

    changePassword,
    changeVerify,
    // changeOtpPage,

    logout,
    signUp,
    resendOTP,
};