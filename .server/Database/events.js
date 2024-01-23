const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  StartTime: { type: String, required: true },
  companyDomain: { type: String, required: true },
  createdBy: { type: String, required: true },
  day: { type: String },
  description: { type: String, required: true },
  authEmail: { type: String, required: true },
  endTime: { type: String, required: true },
  eventDate: { type: String, required: true },
  event_id: { type: String, required: true },
  manager_id: { type: String, required: true },
  propertyId: { type: String, required: true },
  role: { type: String, required: true },
  title: { type: String, required: true },
  type: { type: String, required: true },
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
