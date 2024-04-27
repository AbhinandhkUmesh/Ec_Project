


const cartpage = async (req, res) => {
    try {
        res.render('shoppingCart', {
            isUser: req.session.isUser // Assuming req.session.isUser indicates user authentication
        });
    } catch (error) {
        console.error("Error in cartpage:", error);
        res.render('error'); // Render an error page if there's an error
    }
};

module.exports = {
    cartpage,
};
