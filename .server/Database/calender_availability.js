const mongoose = require("mongoose");
const moment = require("moment");

const convertToUTC = (localTime) => {
  const localMoment = moment(localTime, "h:mm A");
  const utcTime = localMoment.toISOString();

  return utcTime;
};

const ManagerAvailability = mongoose.Schema({
  eventAssignedTo: {
    type: mongoose.Schema.ObjectId,
    refPath: "assignedToType",
  },
  assignedToType: {
    type: String,
    enum: ["PropertyManager", "technicalStaff", "vendor"],
  },
  // manager_id: {
  //     type: mongoose.Schema.ObjectId,
  //     required: true
  // },
  daysOfWeekAvailability: {
    type: Array,
    require: true,
    default: [
      {
        day: "Sun",
        available: false,
        slots: [
          {
            startTime: convertToUTC("9:00 AM"),
            endTime: convertToUTC("5:00 PM"),
          },
        ],
      },
      {
        day: "Mon",
        available: true,
        slots: [
          {
            startTime: convertToUTC("9:00 AM"),
            endTime: convertToUTC("5:00 PM"),
          },
        ],
      },
      {
        day: "Tue",
        available: true,
        slots: [
          {
            startTime: convertToUTC("9:00 AM"),
            endTime: convertToUTC("5:00 PM"),
          },
        ],
      },
      {
        day: "Wed",
        available: true,
        slots: [
          {
            startTime: convertToUTC("9:00 AM"),
            endTime: convertToUTC("5:00 PM"),
          },
        ],
      },
      {
        day: "Thu",
        available: true,
        slots: [
          {
            startTime: convertToUTC("9:00 AM"),
            endTime: convertToUTC("5:00 PM"),
          },
        ],
      },
      {
        day: "Fri",
        available: true,
        slots: [
          {
            startTime: convertToUTC("9:00 AM"),
            endTime: convertToUTC("5:00 PM"),
          },
        ],
      },
      {
        day: "Sat",
        available: true,
        slots: [
          {
            startTime: convertToUTC("9:00 AM"),
            endTime: convertToUTC("5:00 PM"),
          },
        ],
      },
    ],
  },
});

module.exports = mongoose.model("manager_availability", ManagerAvailability);
