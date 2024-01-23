const mongoose = require("mongoose")


// vendorSpecialties Schema 
const technicalStaffSpecialtiesSchema = new mongoose.Schema({
    speciality: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    createdByCompany: {
        type: mongoose.Schema.ObjectId,
        ref: "company"
    },

    createdAt: {
        type: Date,
        default: () => Date.now()
    }

})



module.exports = mongoose.model("technicalStaffSpecialties", technicalStaffSpecialtiesSchema);