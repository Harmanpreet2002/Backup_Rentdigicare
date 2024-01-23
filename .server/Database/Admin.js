const mongoose = require("mongoose")
const crypto = require("crypto");

// Admin Schema 
const adminSchema = new mongoose.Schema({
    role: {
        type:String,
        default: "admin"
    },
    username: String,
    firstname: String,
    lastname: String,
    timezone: String,
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },

    resetPasswordToken: {
        type: String,
        required: false
    },

    resetPasswordExpires: {
        type: Date,
        required: false
    },

    twoFactorEnabled: {
        type: Boolean,
        required: false,
        default: () => false
    },

    verificationCode: {
        type : Number,
        required: false
    },

    codeExpireTime: {
        type: Date,
        required: false
    },

    verificationCodeToken: {
        type: String,
        required: false
    },

    disableCode: {
        type: Number,
        required: false
    },

    loginTime: {
        type: [Date],
        default: () => [Date.now()]
    },
    logoutTime: {
        type: [Date],
        default: () => [Date.now()]
    },
    // TODO device logs
    createdAt: {
        type:Date,
        default: () => Date.now()
    },

    profile:{
        type: String
    }
})

adminSchema.methods.generatePasswordReset = function() {
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordExpires = Date.now() + 3600000; // Expires in an hour
};




module.exports = mongoose.model("admin", adminSchema);
