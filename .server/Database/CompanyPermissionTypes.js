const mongoose = require("mongoose");

const CompanyPermissionTypes = new mongoose.Schema(
    {
        company_id: {
            type: mongoose.Schema.ObjectId, ref: 'company'
        },
        PermissionType: {
            type: "string",
        },
        createdAt: {
            type: Date,
            default: () => Date.now()
        }
    },

);

module.exports = mongoose.model("company_permission_types", CompanyPermissionTypes);
