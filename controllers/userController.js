const User = require('../models/usermodel');
const bcrypt = require('bcrypt');

const addUser = async (req, res) => {
    try {
        console.log("adduser")
        const userExist = await User.findOne({ email: req.body.email });
        if (userExist) {
            return res.redirect("/signup?message=User with this email already exists");
        }
        const hashedPassword = await bcrypt.hash(req.body.password,10);
        const conformPassword = await bcrypt.hash(req.body.conformPassword,10)
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            isAdmin: 0
        });
        if(conformPassword === hashedPassword){
            console.log("conforming password")
            await newUser.save();
            res.redirect('/login'); 
        }
        else{
            console.log("Password not conformed")
            res.redirect(`/signup?message=Conform your password`,{message:req.query.id})
        }
    } catch (error) {
        console.error(error);
        res.redirect('/signup?message=Something went wrong while signing up');
    }
}

const checkUserIn = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.redirect('/login?errmessage=Invalid email or password');
        }
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass) {
            return res.redirect('/login?errmessage=Invalid email or password');
        }
        req.session.isAuth = true;
        req.session.email = user.email;
        res.redirect('/index');
    } catch (error) {
        console.error(error);
        res.redirect('/error?message=Something went wrong while logging in');
    }
}

const userExit = async (req, res) => {
    try {
        await req.session.destroy();
        res.redirect("/");
    } catch (error) {
        console.error(error);
        res.redirect('/error?message=Something went wrong while logging out');
    }
}

module.exports = { addUser, checkUserIn, userExit };
