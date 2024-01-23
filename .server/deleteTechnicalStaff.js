require("dotenv").config()
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true }) // Getting Database Connection


const companyTechnicalStaffSpeciality = require("./Database/companyTechnicalStaffSpeciality")
const calelenderEvents = require("./Database/calender_events")
const tickets = require("./Database/Ticket")
const vendor = require("./Database/vendor")
const PropertyManager = require("./Database/PropertyManager")


const RemoveDocuments = async () => {
    let removed = await companyTechnicalStaffSpeciality.deleteOne()




    console.log("Documents Present", removed)
}


RemoveDocuments()
