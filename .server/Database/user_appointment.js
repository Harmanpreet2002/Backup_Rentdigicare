const mongoose = require("mongoose");



const UserAppointmentAchema = mongoose.Schema({
    eventAssignedTo: {
        type: mongoose.Schema.ObjectId,
        require: true
    },
    slotId : {
        type : String,
        require : true,
        default : "slot" + Date.now().toString()
    },
    assignedToType: {
        type: String,
        require: true
    },
    propertyId : {
        type : mongoose.Schema.ObjectId,
        require : true
    },
    layoutId : {
        type : mongoose.Schema.ObjectId,
       
    },
    name: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
    phone1: {
        type: String,
    },
    email: {
        type: String,
        require: true
    },
    description: {
        type: String,
       
    },
    reasonId : {
        type : mongoose.Schema.ObjectId,
        require : true
    },
    date: {
        type: Date,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    startTimeEpoch: {
        type: Number,
        required: true,
    },
    endTimeEpoch: {
        type: Number,
        required: true,
    },
    companyDomain: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
})





module.exports = mongoose.model("User_appointment", UserAppointmentAchema)
