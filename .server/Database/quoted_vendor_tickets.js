const mongoose = require("mongoose");

const quotedVendorTicketsSchema = mongoose.Schema({
    vendorID: {
        type: mongoose.Schema.ObjectId,
        ref: "vendor",

    },
    ticketID: {
        type: mongoose.Schema.ObjectId,
        ref: "ticket",

    },
    startDate: {
        type: Date,
    },
    startTime: {
        type: String,
        default: ""

    },
    estimatedEndDate: {
        type: Date,

    },
    estimatedETime: {
        type: String,
        default: ""

    },
    notes: {
        type: String,
        default: ""

    },
    estimatedAmount: {
        type: String
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    documents: {
        type: String
    }

})

// quotedVendorTicketsSchema.index({ vendorID: 1, ticketID: 1 }, { unique: true })


module.exports = mongoose.model("quoted_vendor_ticket", quotedVendorTicketsSchema)
