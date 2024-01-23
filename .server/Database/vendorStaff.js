const mongoose = require("mongoose")


// vendorStaff Schema 
const vendorStaffSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    
    agency: {
        type: mongoose.Schema.ObjectId,
        ref: "vendor"
    },
    specialties: {
        type: [mongoose.Schema.ObjectId],
        required: true
    },
    Id_proof: {
        type: String,
        required: true,
    },
    profile: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: () => Date.now()
    }

})



module.exports = mongoose.model("vendorStaff", vendorStaffSchema);