const router = require("express").Router();
const Conversation = require("../Database/Conversation");
const Message = require("../Database/Message");

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

//add

router.post("/", async (req, res) => {
    const newMessage = new Message(req.body);

    try {
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    } catch (err) {
        res.status(500).json(err);
    }
});

//get

router.post("/:conversationId", async (req, res) => {
    try {


        const conversationNotification = await Conversation.find({ _id: req.params.conversationId, notification: true, offline_user: ObjectId(req.body.senderId) })


        if (conversationNotification.length > 0) {
            const notification = await Conversation.updateOne({ _id: req.params.conversationId }, {
                notification: false
            })

            console.log(notification)
        }


        const messages = await Message.find({
            conversationId: req.params.conversationId,
        });
        res.status(200).json(messages);
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
});

module.exports = router;
