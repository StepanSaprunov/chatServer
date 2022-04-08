const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    user: {type: mongoose.Types.ObjectId, required: true},
    body: {type: String, required: true},
    date: {type: Date, default: Date.now},
    room: {type: mongoose.Types.ObjectId, required: true},
});

module.exports = messageSchema;