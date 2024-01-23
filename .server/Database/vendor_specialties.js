const mongoose = require("mongoose")


// vendorSpecialties Schema 
const vendorSpecialtiesSchema = new mongoose.Schema({
    specialty: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.ObjectId
    },

    createdAt: {
        type: Date,
        default: () => Date.now()
    }

})



module.exports = mongoose.model("vendorSpecialties", vendorSpecialtiesSchema);