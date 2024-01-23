require("dotenv").config()
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true }) // Getting Database Connection


const calender = require("./Database/calender_availability")
const calelenderEvents = require("./Database/calender_events")
const tickets = require("./Database/Ticket")
const vendor = require("./Database/vendor")
const PropertyManager = require("./Database/PropertyManager")


const RemoveDocuments = async () => {
    let removed = await calender.remove()
    let removeEvents = await calelenderEvents.remove()
    let reemovetickets = await tickets.remove()
    let removevendor = await vendor.remove()


    let checkdocuments = await calender.find()
    let checkEvents = await calelenderEvents.find()
    let checkTickets = await tickets.find()
    let checkVendor = await vendor.find()

    let updatePropertyManagers = await PropertyManager.updateMany({}, { $set: { ticketPrivilege: true, applicationPrivilege: true } })


    console.log("Documents Present", checkdocuments.length, checkEvents.length, checkTickets.length, checkVendor.length, updatePropertyManagers)
}


RemoveDocuments()
