
const isUser = async (req, res, next) => {
    try {
        // const email = req.session.email
        // const UserStatus = await userModel.findOne({ email: email });
        // if(UserStatus.status == true){
        //     next();
        // }else{
        //     res.redirect('/login?error=Your account is Blocked');
        // }
        if (req.session.isUser) {
            next();
        } else {
            res.redirect('/login');
        }
    } catch (err) {
        console.log("user controller isUser error: " + err);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = { isUser };
