const mongoose = require("mongoose");

const CalendarReasonTypes = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.ObjectId,
      ref: "company",
    },
    reasonType: {
      type: "string",
    },
    color: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("calendar_reason_types", CalendarReasonTypes);
