const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    user: mongoose.Types.ObjectId,
    body: String,
    date: String,
    room: mongoose.Types.ObjectId,
});

module.exports = messageSchema;