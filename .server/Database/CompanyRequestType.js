const mongoose = require("mongoose");

const CompanyRequestType = new mongoose.Schema(
    {
        company_id: {
            type: mongoose.Schema.ObjectId, ref: 'company'
        },
        request_type: {
            type: "string"
        },
        createdAt: {
            type: Date,
            default: () => Date.now()
        }
    },

);

module.exports = mongoose.model("company_request_type", CompanyRequestType);
