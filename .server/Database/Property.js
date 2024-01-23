const mongoose = require("mongoose");
const propertySchema = mongoose.Schema({
  primaryID: {
    type: String,
    required: true,
    unique: true,
    default: () =>
      "PRO" +
      Math.random().toString().slice(-4) +
      Date.now().toString().slice(-4),
  },
  title: {
    type: String,
    required: true,
  },
  propertySignature: {
    type: String,
    required: false,
  },
  companyID: {
    type: String,
    required: true,
  },

  company: {
    type: String,
    required: true,
  },
  companyDomain: {
    type: String,
    required: true,
  },
  category: {
    type: [mongoose.Schema.ObjectId],
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  managers: {
    type: [mongoose.Schema.ObjectId],
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  document: {
    type: [String],
  },
  status: {
    type: String,
    required: true,
    default: "Inactive",
    enum: ["Active", "Inactive"],
  },
  currency: {
    type: String,
    default: "CAD",
  },
  rent_amount: {
    type: String,
    require: true,
  },
  building: {
    type: [
      {
        buildingName: { type: String },
        floors: { type: Number },
      },
    ],
  },
  postal_code: {
    type: String,
  },
  address: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
  modifiedAt: {
    type: Date,
    default: () => Date.now(),
  },
});

module.exports = mongoose.model("property", propertySchema);
