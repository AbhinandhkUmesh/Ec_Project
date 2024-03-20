const userModel = require('../models/usermodel');
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');

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
            message
        });
        console.log("User signup");
    } catch (error) {
        console.log("Error rendering user signup page: " + error);
        res.status(500).send("Internal Server Error signup");
    }
};


const addUser = async (req, res) => {
    try {
        const userExist = await userModel.findOne({
            email: req.body.email
        });
        if (userExist) {
            return res.redirect("/signup?message=User with this email already exists");
        }

        if (req.body.password !== req.body.confirmPassword) {
            return res.redirect("/signup?message=Passwords do not match");
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const registeredUser = new userModel({
            Username: req.body.Username,
            email: req.body.email,
            password: hashedPassword,
            isAdmin: 0,
        });
        
        req.session.email = registeredUser.email;
        console.log(registeredUser);
        res.redirect('/otpPage');
        return registeredUser
    } catch (error) {
        console.error("Error adding user: " + error);
        res.status(500).send("Internal Server Error");
    }
};

const otpPage = (req, res) => {
    try {
        let message = req.query.message;
        let email = req.session.email;
        res.render('otppage', {
            message,
            email
        });
    } catch (error) {
        console.log("Error rendering user otp page: " + error);
        res.status(500).send("Internal Server Error on otp");
    }
};


const generateOTP = (req,res) => {
    const OTP = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false
    });
    console.log(OTP)
    return OTP
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your_email@gmail.com',
        pass: 'your_password'
    }
});

const sentOtp = async (req, res) => {
    const email = req.session.email;
    console.log(email);

    const OTP = generateOTP();

    var mailOption = {
        from: 'abhikappana@gmail.com',
        to: email,
        subject: "OTP From ANB_STORE",
        text: `Your OTP is : ${OTP}`
    };

    transporter.sendMail(mailOption, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent successfully');
        }
    });
};


//  const verifyOtp = async (req ,rec) => {
//     try{

//     }
//     catch (error) {
//         console.error("Error occurred:", error);
//         res.status(500).send("Internal Server Error");
//     }
//  }


const checkUserIn = async (req, res) => {
    try {
        const email = req.body.email;
        const userProfile = await userModel.findOne({
            email
        });

        if (!userProfile) {
            req.session.error = "Not a registered user. Please register first";
            return res.redirect('/login');
        }

        const checkPass = await bcrypt.compare(req.body.password, userProfile.password);

        if (checkPass) {
            console.log("Password checked");
            req.session.isUser = true;
            req.session.Username = userProfile.Username;
            req.session.email = email;
            return res.redirect("/home");
        } else {
            req.session.error = "Incorrect password";
            console.log("Incorrect password");
            return res.redirect("/login");
        }
    } catch (error) {
        console.log("Error validating user: " + error);
        res.status(500).send("Internal Server Error");
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
        const userProfile = await userModel.findOne({
            email: userEmail
        });
        if (req.session.isUser) {
            res.render('userDetails', {
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
    addUser,
    checkUserIn,
    redirectUser,
    userDetails,
    logout,
    otpPage,
    sentOtp,

};