const mongoose = require("mongoose");

const RentDigiNewsletter = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  deleteStatus: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Number,
    default: () => {
      return Math.round(new Date() / 1000);
    },
  },
  creationDate: {
    type: Date,
    default: () => {
      return new Date();
    },
  },
});

const rentdiginewsletter = new mongoose.model(
  "rentdiginewsletter",
  RentDigiNewsletter
);

module.exports = {
  rentdiginewsletter,
};
