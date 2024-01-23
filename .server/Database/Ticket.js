const mongoose = require("mongoose");

const ticketSchema = mongoose.Schema(
  {
    name: String,
    email: String,
    phone: Number,
    details: String,

    requestType: String,
    permission: String,
    property: String,
    propertyID: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    suite: String,
    startDate: {
      type: Date,
    },
    startTime: {
      type: String,
      default: "",
    },
    estimatedEndDate: {
      type: Date,
    },
    estimatedETime: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
    estimatedAmount: {
      type: String,
    },
    customerSatisfaction: {
      type: Boolean,
    },
    internalStatus: {
      type: String,
      default: "Open",
      enum: [
        "Open",
        "Assigned",
        "Inprogress",
        "Done",
        "Completed",
        "Paid",
        "Unresolved",
      ],
    },
    status: {
      type: String,
      default: "Open",
      enum: ["Open", "Inprogress", "Completed", "Unresolved"],
    },
    priority: String,
    createdByid: {
      type: mongoose.Schema.ObjectId,
      // required: true,
    },
    createdByRole: {
      type: String,
      // required: true,
    },
    assignVendor: {
      type: mongoose.Schema.ObjectId,
      ref: "vendor",
    },
    assignedTo: {
      type: mongoose.Schema.ObjectId,
      refPath: "assignedToType",
    },
    assignedToType: {
      type: String,
      enum: ["vendor", "technicalStaff"],
    },

    assignSpecificVendors: {
      type: [mongoose.Schema.ObjectId],
      ref: "vendor",
    },
    quotedVendorTickets: {
      type: [mongoose.Schema.ObjectId],
      ref: "quoted_vendor_ticket",
    },
    confirmedQuote: {
      type: mongoose.Schema.ObjectId,
      ref: "quoted_vendor_ticket",
    },

    isMovedToVendorPortal: {
      type: Boolean,
      default: false,
    },
    ratings: {
      type: String,
      default: "0",
    },
    reviews: {
      type: String,
      default: "",
    },
    building: {
      type: String,
      default: "",
    },
    // TODO: Documents
    // documents: [String],
    companyDomain: {
      type: String,
      require: true,
    },
    companyID: {
      type: mongoose.Schema.ObjectId,
      ref: "company",
    },
    documents: {
      type: Array,
    },
    history: {
      type: Array,
    },
    primaryID: {
      type: String,
      required: true,
      unique: true,
      default: () =>
        "TIK" +
        Math.random().toString().slice(-4) +
        Math.floor(Date.now().toString().slice(-4)),
    },
    propertyManagerId: {
      type: [mongoose.Schema.ObjectId],
      ref: "PropertyManager",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);
