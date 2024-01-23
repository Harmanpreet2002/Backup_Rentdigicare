const mongoose = require("mongoose")
const crypto = require("crypto");
const otpGenerator = require('otp-generator');
const Customer = require("./Customer");

// Transactions Schema 
const transactionsSchema = new mongoose.Schema({
    sender_id: {
        type: mongoose.Schema.ObjectId,
        required: true,
        // ref: "Customer"
    },

    companyDomain: {
        type: String,
        required: true
    },
    property_id: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    payment_status: {
        type: String,
        required: true
    },
    checkout_session_id: {
        type: String,
        // required: true
    },
    createdAt: {
        type: Date,
        default: () => Date.now()
    }

})



module.exports = mongoose.model("Transactions", transactionsSchema);
