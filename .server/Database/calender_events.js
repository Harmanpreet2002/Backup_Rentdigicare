const mongoose = require("mongoose");

const Calender_events = mongoose.Schema({
  eventId: {
    type: String,
  },
  eventAssignedTo: {
    type: mongoose.Schema.ObjectId,
    refPath: "assignedToType",
  },
  assignedToType: {
    type: String,
    enum: ["PropertyManager", "technicalStaff", "vendor"],
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  propertyId: {
    type: String,
    ref: "property",
  },
  propertyName: {
    type: String,
  },
  companyDomain: {
    type: String,
  },
  type: {
    type: String,
    required: true,
  },
  eventDate: {
    type: Date,
    require: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
});

module.exports = mongoose.model("calender_events", Calender_events);
