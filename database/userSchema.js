const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    login: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: [String], default: ['User']}
});

module.exports = userSchema;
