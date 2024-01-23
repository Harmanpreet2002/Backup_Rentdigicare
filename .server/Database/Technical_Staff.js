const mongoose = require("mongoose")
const otpGenerator = require('otp-generator')
const crypto = require("crypto");



// vendor Schema 
const technicalStaffSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contact_no: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        default: ""
    },
    username: String,
    timezone: String,
    assigned_properties: {
        type: [mongoose.Schema.ObjectId],
        required: true
    },
    assigned_companies: {
        type: [mongoose.Schema.ObjectId],
        required: true
    },
    resetPasswordToken: {
        type: String,
        required: false
    },
    otp: {
        type: String,
        required: false
    },

    role: {
        type: String,
        default: "technicalStaff"
    },

    specialties: {
        type: [mongoose.Schema.ObjectId],
        required: true,
        ref: "technicalStaffSpecialties"
    },

    Id_proof: {
        type: String,
        required: false,
    },
    primaryID: {
        type: String,
        required: true,
        unique: true,
        default: () => "TES" + Math.random().toString().slice(-4)+Date.now().toString().slice(-4)
    },
    profile: {
        type: String,
        required: false
    },
    skills: {
        type: String,
    },
    status: {
        type: String,
        default: "Verified",
        enum: [ "Verified", "Rejected", "Suspended"],
      },
    createdAt: {
        type: Date,
        default: () => Date.now()
    },

    rating: {
        type: Number,
        default: 0
    }

})

technicalStaffSchema.methods.generatePasswordReset = function () {
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordExpires = Date.now() + 3600000; // Expires in an hour
};

technicalStaffSchema.methods.generateOTP = function () {
    let generatedOtp = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false });
    this.otp = generatedOtp;
};

module.exports = mongoose.model("technicalStaff", technicalStaffSchema);