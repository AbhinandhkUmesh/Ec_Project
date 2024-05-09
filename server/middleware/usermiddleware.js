const isUser = async (req, res, next) => {
    try {
        // Check if the user is authenticated
        if (req.session.isUser) {
            // Check if the session has not expired
            const currentTime = Date.now();
            const sessionTimeout = 30 * 60 * 1000; // 30 minutes in milliseconds
            if (req.session.lastAccess && (currentTime - req.session.lastAccess < sessionTimeout)) {
                req.session.lastAccess = currentTime; // Update last access time
                next(); // Continue to the next middleware or route handler
            } else {
                // Session has expired, redirect to login
                req.session.destroy(); // Clear session data
                res.redirect('/login?expired=true');
            }
        } else { 
            // User is not authenticated, redirect to login
            res.redirect('/login');
        }
    } catch (err) {
        console.log("user controller isUser error: " + err);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    isUser
};
