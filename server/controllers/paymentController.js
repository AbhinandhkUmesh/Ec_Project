const Razorpay = require("razorpay");
require("dotenv").config();

const razorpayInstance = new Razorpay({
  key_id: process.env.PAYMENT_GATEWAY_API_KEY,
  key_secret: process.env.PAYMENT_GATEWAY_KEY_SECRET, // Replace with your key secret
});

const createRazorpayOrder = async (req, res) => {
  const { finalPrice } = req.body; // Extract finalPrice directly from req.body
  console.log('Request body:', req.body);
  console.log("+++++++++createRazorpayOrder");

  try {
    if (!finalPrice || isNaN(finalPrice)) {
      return res.status(400).json({ message: "Invalid finalPrice" });
    }
    console.log("///finalPrice:",finalPrice)
    const options = {
      amount: finalPrice, // Amount in paise
      currency: "INR",
      receipt: "order_rcptid_11", // Unique identifier for the receipt
    };



    razorpayInstance.orders.create(options, (err, order) => {
      if (err) {
        console.error("Error creating Razorpay order:", err);
        return res.status(500).json({ message: "Failed to create order" });
      }
      console.log("////order:",order)
      res.status(200).json(order);
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createRazorpayOrder
};
