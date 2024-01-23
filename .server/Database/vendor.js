const mongoose = require("mongoose");
const otpGenerator = require("otp-generator");
const crypto = require("crypto");

// vendor Schema
const vendorSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contact_no: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    default: "",
  },
  username: String,
  resetPasswordToken: {
    type: String,
    required: false,
  },
  otp: {
    type: String,
    required: false,
  },
  address: {
    type: String,
  },
  role: {
    type: String,
    default: "vendor",
  },
  agency_name: {
    type: String
  },
  specialties: {
    type: [mongoose.Schema.ObjectId],
    required: true,
    ref: "vendorSpecialties",
  },
  connectedManagers: {
    type: [mongoose.Schema.ObjectId],
    ref: "PropertyManager",
    default: [],
  },
  rating: {
    type: Number,
    default: 0,
  },
  approvedCompanies: {
    type: [mongoose.Schema.ObjectId],
    ref: "company",
    default: [],
  },
  rejectetedCompaines: {
    type: [mongoose.Schema.ObjectId],
    ref: "company",
    default: [],
  },
  interestedCompanies: {
    type: [mongoose.Schema.ObjectId],
    ref: "company",
    default: [],
  },
  Id_proof: {
    type: String,
  },
  profile: {
    type: String,
  },
  timezone: String,
  verified: {
    type: Boolean,
    required: true,
    default: false,
  },
  primaryID: {
    type: String,
    required: true,
    unique: true,
    default: () => "VEN" + Math.random().toString().slice(-4)+Date.now().toString().slice(-4)
},
  staffs: [{ type: mongoose.Schema.ObjectId, ref: "vendorStaff" }],
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Verified", "Rejected", "Suspended"],
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
});

vendorSchema.methods.generatePasswordReset = function () {
  this.resetPasswordToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordExpires = Date.now() + 3600000; // Expires in an hour
};

vendorSchema.methods.generateOTP = function () {
  let generatedOtp = otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    specialChars: false,
  });
  this.otp = generatedOtp;
};
vendorSchema.index({ agency_name: 1 }, { unique: false });

module.exports = mongoose.model("vendor", vendorSchema);
