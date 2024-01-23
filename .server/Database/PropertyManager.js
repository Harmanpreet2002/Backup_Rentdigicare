const mongoose = require("mongoose");
const crypto = require("crypto");
const propertyManagerSchema = mongoose.Schema({
        primaryID: {
                type: String,
                required: true,
                unique: true,
                default: () => "MNG" + Math.random().toString().slice(-4)+Date.now().toString().slice(-4)
            },
        username: String,
        timezone: String,
        role: {
                type: String,
                default: "manager"
        },
        firstname: {
                type: String,
                required: true
        },
        lastname: {
                type: String,
        },

        email: {
                type: String,
                required: true
        },
        profile: {
                type: String,
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

        mobile: {
                type: String,
                required: true
        },
        status: {
                type: String,
                required: true
        },
        timezone: {
                type: String,
                required: true
        },
        properties: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'property',
                required: true
        }],
        propertyType: String,

        companyAssigned: {
                type: String,
                required: true
        },

        companyID: {
                type: String,
                required: true,
                ref: "company"
        },

        ticketPrivilege: {
                type: Boolean,
                default: false
        },
        applicationPrivilege: {
                type: Boolean,
                default: false
        },
        calendarPrivilege: {
                type: Boolean,
                default: false
        },
        
        createdAt: {
                type: Date,
                default: () => Date.now()
        },
        documents: {
                type: [String],
                required: true
        }
})

propertyManagerSchema.methods.generatePasswordReset = function () {
        this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
        this.resetPasswordExpires = Date.now() + 3600000; // Expires in an hour
};

module.exports = mongoose.model("PropertyManager", propertyManagerSchema)