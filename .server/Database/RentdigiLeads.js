const mongoose = require("mongoose");

// Admin Schema
const rendigiLeadSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  company:String,
//   interestedApartment: String,
//   interestedBedroomType: String,
//   websiteURL: String,
//   propertyName: String,
//   propertyUrl: String,
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Closed", "Cancelled", "Follow Up"],
  },
  primaryID: {
    type: String,
    required: true,
    unique: true,
    default: () =>
      "LDS" +
      Math.random().toString().slice(-4) +
      Date.now().toString().slice(-4),
  },

  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
});

module.exports = mongoose.model("rentdigiLeads", rendigiLeadSchema);
