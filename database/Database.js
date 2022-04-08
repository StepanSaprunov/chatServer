const mongoose = require("mongoose");
const messageSchema = require("./messageSchema.js");
const roomSchema = require("./roomSchema.js");
const userSchema = require("./userSchema.js");

class Database {
    constructor(URL) {
        this.URL = URL;
        this._messageSchema = messageSchema;
        this._userSchema = userSchema;
        this._roomSchema = roomSchema;
        this._Room = mongoose.model('Room', this._roomSchema);
        this._User = mongoose.model('User', this._userSchema);
        this._Message = mongoose.model('Message', this._messageSchema);
        this.connected = false;
    }

    async connect() {
        await mongoose.connect(this.URL);
        this.connected = true;
    }

    async getMessages(room, page=1, messagesPerPage=100) {
        if (!this.connected) await this.connect();
        const roomId = await this.getRoomIdByName(room);
        const messages = await this._Message.find({room: roomId}).sort({_id: -1}).limit(page*messagesPerPage);
        return messages.slice((page-1)*messagesPerPage);
    }

    async addUser(user) {
        if (!this.connected) await this.connect();
        const userDocument = new this._User(user);
        const success = await userDocument.save();
    }

    async isUserExist(user) {
        if (!this.connected) await this.connect();
        const u = await this._User.findOne(user);
        if (u) return true;
        else return false;
    }

    async getUserByLogin(login) {
        if (!this.connected) await this.connect();
        return await this._User.findOne({login});
    }

    async getUsers() {
        if (!this.connected) await this.connect();
        return await this._User.find({});
    }

} 

module.exports = Database;