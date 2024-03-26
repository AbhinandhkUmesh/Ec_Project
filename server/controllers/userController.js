const userModel = require('../models/usermodel');
const bcrypt = require('bcrypt');
const otpSend = require("../middleware/otp");
const { log } = require('console');

const index = async (req, res) => {
    try {
        if (req.session.isUser) {
            res.redirect('/home');
        } else {
            res.render('home', {
                isUser: req.session.isUser
            });
            console.log("index Page");
        }
    } catch (error) {
        console.log("Error rendering index page: " + error);
        res.status(500).send("Internal Server Error");
    }
};

const login = (req, res) => {
    try {
        let error = req.query.error;
        if (req.session.isUser) {
            res.redirect('/home');
        } else {
            res.render('userlogin', {
                isUser: req.session.isUser,
                error
            });
        }
    } catch (error) {
        console.log("Error rendering user login page: " + error);
        res.status(500).send("Internal Server Error");
    }
};

const signup = (req, res) => {
    try {
        let message = req.query.message;
        res.render("signup", {
            isUser: req.session.isUser,
            message
       });
        console.log("User signup");
    } catch (error) {
        console.log("Error rendering user signup page: " + error);
        res.status(500).send("Internal Server Error signup");
    }
};

var OTP;
const signUp = (req, res) => {
  try {
    console.log(req.body);
    req.session.userDetails = req.body;

    message = ""
    const email = req.body.email;
    console.log("sending otp");
    const otpData = otpSend.sendmail(email);
    console.log(otpData);
    OTP = otpData;
    console.log("OTP received is: " + otpData);
    res.render("otppage",{OTP,email,message});
    console.log("User OTP Page");
  } catch (err) {
    console.log("error in veriy otp" + err);
  }
}; 

const authOTP = async (req, res) => {
    try {
        const otp = req.body.otp;
        const storedOTP = OTP;
        console.log(otp,"1st test",storedOTP) // Retrieve the OTP stored in the session
        if (otp === storedOTP) { // Compare the entered OTP with the stored one
            // Hash the password
            const hashedPassword = await bcrypt.hash(req.session.userDetails.password, 10);
            // Create a new user with hashed password
            const registeredUser = new userModel({
                Username: req.session.userDetails.Username,
                password: hashedPassword,
                email: req.session.userDetails.email,
                isAdmin: 0,
            });
            console.log("2st test")
            await registeredUser.save(); // Save the user to the database
            console.log("",registeredUser)
            res.redirect("/login");
        } else {
            res.render("otppage", {email:req.session.userDetails.email,message: "Invalid OTP entered"});
        }
    } catch (err) {
        console.log("Error while authenticating OTP: " + err);
        res.status(500).send("Internal Server Error");
    }
}; 



const resendOTP = (req, res) => {
    try {
      //console.log("Hello");
      const email = req.session.emailDetail;
      console.log("Resending OTP to email: " + email);
      const otpRData = otpSend.sendmail(email);
      console.log("otpRData is ++++++" + otpRData);
      newOTP = otpRData;
      console.log(
        "OTP received after 60s is: " + newOTP + " and timestamp is:  " + otpRData
      );
      req.session.otpTimestamp = otpRData[1];
      message = req.session.otpError;
      res.redirect("/otp");
      console.log("USER RESEND OTP PAGE");
    } catch (error) {
      console.log("Error while resending OTP :" + error);
    }
  }; 

const otpPage = (req, res) => {
    try {
        let message = 0;
        let email = req.session.email;
        res.render('otppage', {
            message: "Invalid OTP entered",
            email
        });
    } catch (error) {
        console.log("Error rendering user otp page: " + error);
        res.status(500).send("Internal Server Error on otp");
    }
};

const checkUserIn = async (req, res) => {
    try {
        console.log("check 1");
        const email = req.body.email;
        const userProfile = await userModel.findOne({ email: email });
        console.log(email, "check 2", userProfile);

        if (!userProfile) {
            console.log("User not found in the database.");
            req.session.error = "Not a registered user. Please register first.";
            return res.redirect('/login');
        }

        console.log(req.body.password);
        console.log(userProfile.password);

        const checkPass = await bcrypt.compare(req.body.password, userProfile.password);

        if (checkPass) {
            console.log("Password checked");
            req.session.isUser = true;
            req.session.Username = userProfile.Username;
            req.session.email = email;
            return res.redirect("/home");
        } else {
            console.log("Incorrect password");
            req.session.error = "Incorrect password. Please try again.";
            return res.redirect("/login");
        }
    } catch (error) {
        console.log("Error validating user:", error);
        req.session.error = "Internal Server Error. Please try again later.";
        return res.status(500).redirect("/login");
    }
};


const redirectUser = async (req, res) => {
    try {
        res.render("home", {
            isUser: req.session.isUser
        });
    } catch (error) {
        console.log("Error redirecting user: " + error);
        res.status(500).send("Internal Server Error");
    }
};

const userDetails = async (req, res) => {
    try {
        const userEmail = req.session.email;
        const userProfile = await userModel.findOne({ email: userEmail });
        if (req.session.isUser) {
            res.render('userDetails', {
                isUser: req.session.isUser,
                username: userProfile.Username,
                email: userProfile.email
            });
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        console.log("Error redirecting UserPage: " + error);
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
            res.redirect("/login");
        });
        console.log("User logged out");
    } catch (error) {
        console.log("Error during user signout:", error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    index,
    login,
    signup,
    authOTP,
    otpPage,
    checkUserIn,
    redirectUser,
    userDetails,
    logout,
    signUp,
    resendOTP
};
