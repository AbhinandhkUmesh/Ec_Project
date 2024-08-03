const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    userID: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'UserData',
        required : true
    },
    orderID: {
        type: String,
        required: true,
        trim: true,
    },
    user: {
        type: String,
        trim: true,
    },
    products: {
        type: Array,
        required: true,
        trim: true,
    },
    totalOrderValue: {
        type: Number,
        required: true,
        trim: true,
    },

//   discount: {
//     type: Number,
//     required: true,
//     trim: true,
//   },

    address: {
        type: Object,
        required: true,
        trim: true,
    },

  paymentMethod: {
    type: String,
    required: true,
    trim: true,
  },

    date: {
        type: Date,
        trim: true,
    },

    status: {
        type: String,
        required: true,
        trim: true,
    },
  paymentStatus: {
    type: String,
    trim: true,
  },
//   return_Reason: {
//     type: String,
//     trim: true,
//   },

    cancel: {
        type: String,
        trim: true
    },
});

const orderCollection =new mongoose.model("order", orderSchema);
module.exports = orderCollection;