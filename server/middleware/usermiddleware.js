const isUser = (req, res, next) => {
    try {
        if (req.session.isUser ) {
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
