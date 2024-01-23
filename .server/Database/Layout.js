const mongoose = require("mongoose")

// Admin Schema
const Layout = new mongoose.Schema({
    layoutOf: String,
    layoutName: String
});

module.exports = mongoose.model("layout", Layout);
