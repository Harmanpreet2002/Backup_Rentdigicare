const mongoose = require("mongoose");
const crypto = require("crypto");
const otpGenerator = require("otp-generator");

// Admin Schema

const customerSchema = new mongoose.Schema({
  role: {
    type: String,
    default: "Customer",
  },

  email: {
    type: String,
    required: true,
  },

  due_date: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  firstname: {
    type: String,
    required: false,
  },

  lastname: {
    type: String,
  },

  username: {
    type: String,
    required: true,
  },

  profile: {
    type: String,
  },

  timezone: String,

  resetPasswordToken: {
    type: String,
    required: false,
  },

  otp: {
    type: String,
    required: false,
  },

  resetPasswordExpires: {
    type: Date,
    required: false,
  },

  isActive: {
    type: Boolean,
    default: () => true,
  },

  twoFactorEnabled: {
    type: Boolean,
    required: false,
    default: () => false,
  },

  verificationCode: {
    type: Number,
    required: false,
  },

  codeExpireTime: {
    type: Date,
    required: false,
  },

  verificationCodeToken: {
    type: String,
    required: false,
  },

  disableCode: {
    type: Number,
    required: false,
  },

  loginTime: {
    type: [Date],
    default: () => [Date.now()],
  },

  logoutTime: {
    type: [Date],
    default: () => [Date.now()],
  },

  mobile: {
    type: String,
    required: true,
  },

  properties: {
    type: [mongoose.Schema.ObjectId],
    required: true,
  },

  // TODO device logs
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },

  document: {
    type: [String],
    required: false,
  },

  suite: {
    type: String,
    required: false,
  },

  applicantId: {
    type: String,
    required: false,
  },
});

customerSchema.methods.generatePasswordReset = function () {
  this.resetPasswordToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordExpires = Date.now() + 3600000; // Expires in an hour
};

customerSchema.methods.generateOTP = function () {
  let generatedOtp = otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    specialChars: false,
  });
  this.otp = generatedOtp;
};

module.exports = mongoose.model("Customer", customerSchema);
