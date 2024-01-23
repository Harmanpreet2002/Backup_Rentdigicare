const mongoose = require("mongoose");

const ticketNotesSchema = mongoose.Schema({
    ticketID: {
        type: mongoose.Schema.ObjectId,
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    note: {
        type: String,
        required: true,
    },
    user:{
        type:String
    },
    userName:{
        type:String
    },
    visited: {
        type: [mongoose.Schema.Types.ObjectId], // Array of ObjectIds
        default: [], // Default value as an empty array
    }
});

module.exports = mongoose.model("ticket_note", ticketNotesSchema);
