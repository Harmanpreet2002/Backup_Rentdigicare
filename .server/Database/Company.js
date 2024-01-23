const mongoose = require("mongoose");
const crypto = require("crypto");

const companySchema = mongoose.Schema({
    username: String,
    timezone: String,
    phone: String,
    ownerFirstName: {
        type: String,
        required: true
    },
    primaryID: {
        type: String,
        required: true,
        unique: true,
        index: true,
        default: () => "CMP"+Date.now().toString()
    },
    ownerLastName: {
        type: String,
    },

    ownerName: {
        type: String,
    },

    name: {
        type: String,
        required: true,
        unique:true
    },
    address: {
        type: [String],
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "company"
    },
    email: {
        type: String,
        required: true,
        unique:true,
    },
    password: String,

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
        type: Number,
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
    logo: {
        type: String,
    },
    domain: {
        type: String,
        required: true,
        unique:true
    },
    ticketEmailDays: {
        type: Number,
        default: 3
    },
    profile: {
        type: String,
        required: false
    },
    uniqueURL: String,
    scriptURL: String,
    scriptName: String,
    scriptContent: String,
    createdAt: {
        type: Date,
        default: () => Date.now()
    },
    slug:{
        type:String
    }
})

companySchema.methods.generatePasswordReset = function () {
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordExpires = Date.now() + 3600000; // Expires in an hour
};

module.exports = mongoose.model("company", companySchema)