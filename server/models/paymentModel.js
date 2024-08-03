const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    sessionId: String,
    status: String,
    amount: Number,
    // other fields as required
});

module.exports = mongoose.model('Payment', paymentSchema);
