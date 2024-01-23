const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
    {
        members: {
            type: [mongoose.Schema.ObjectId],
        },
        notification: {
            type: Boolean,
            default: false
        },
        offline_user: mongoose.Schema.ObjectId
    },

    { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);
