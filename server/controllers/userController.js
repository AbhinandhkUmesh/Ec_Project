const userModel = require('../models/usermodel');
const bcrypt = require('bcrypt');

const index = async (req, res) => {
    try {
        if (req.session.isUser) {
            res.redirect('/home');
        } else {
            res.render('home', { isUser: req.session.isUser });
            console.log("index Page");
        }
    } catch (error) {
        console.log("Error happened while rendering index page: " + error);
        res.status(500).send("Internal Server Error");
    }
}

const login = (req, res) => {
    try {
        let error = req.query.error;
        if (req.session.isUser) {
            res.redirect('/home');
        } else {
            res.render('userlogin',  { error });
        }
    } catch (error) {
        console.log("Error while rendering user login page: " + error);
        res.status(500).send("Internal Server Error");
    }
}

const signup = (req, res) => {
    try {
        let error = req.query.error;
        res.render("signup", {error});
        console.log("User signup");
    } catch (error) {
        console.log("Error while rendering user signup page: " + error);
        res.status(500).send("Internal Server Error");
    }
};



const addUser = async (req, res) => {
    try {
        req
        const userExist = await userModel.findOne({ email: req.body.email });
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
        await registeredUser.save();
        res.redirect('/login');
        console.log(registeredUser);

    } catch (error) {
        console.error("Error while adding user: " + error);
        res.status(500).send("Internal Server Error");
    }
}

const checkUserIn = async (req, res) => {
    try {
        const email = req.body.email;
        console.log(email);
        const userProfile = await userModel.findOne({ email: email });

        if (!userProfile) {
            req.session.error = "Not a registered user. Please register first";
            return res.redirect('/login');
        }

        const checkPass = await bcrypt.compare(req.body.password, userProfile.password);

        if (checkPass) {
            console.log("password checked");
            if (userProfile) {
                req.session.isUser = true;
                req.session.Username = userProfile.Username;
                req.session.email = req.body.email;
                console.log(req.session.isUser);
                return res.redirect("/home");
            } else {
                return res.redirect("/login");
            }
        } else {
            req.session.error = "Incorrect password";
            console.log("Incorrect password");
            return res.redirect("/login");
        }
    } catch (error) {
        console.log("Error in validating user: " + error);
        res.status(500).send("Internal Server Error");
    }
}

const redirectUser = async (req, res) => {
    try {
        const userEmail = req.session.email;
        console.log(userEmail);
        res.render("home",{isUser:req.session.isUser});
    } catch (error) {
        console.log("Error while redirecting user: " + error);
        res.status(500).send("Internal Server Error");
    }
};

const userDetails = async (req,res) =>{
    try{
        const userEmail = req.session.email;
        const userProfile = await userModel.findOne({ email: userEmail });
        if(req.session.isUser){
            res.render('userDetails',{ username: userProfile.Username, email: userProfile.email,})
        }else{
            res.redirect('/login')
        }
    }
    catch{
        console.log("Error while redirecting UserPage: " + error);
        res.status(500).send("Internal Server Error");
    }
}

const logout = (req, res) => {
    try {
        // Clear all sessions
        req.session.destroy(err => {
            if (err) {
                console.log("Error clearing sessions:", err);
                return res.status(500).send("Internal Server Error");
            }
            // Redirect to login page
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

};
