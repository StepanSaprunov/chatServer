const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    name: {type: String, required: true},
});

module.exports = roomSchema;