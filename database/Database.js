const mongoose = require("mongoose");
const messageSchema = require("./messageSchema.js");
const roomSchema = require("./roomSchema.js");
const userSchema = require("./userSchema.js");

class Database {
    constructor() {
        this._messageSchema = messageSchema;
        this._userSchema = userSchema;
        this._roomSchema = roomSchema;
        this._Room = mongoose.model('Room', this._roomSchema);
        this._User = mongoose.model('User', this._userSchema);
        this._Message = mongoose.model('Message', this._messageSchema);
    }

    async connect(URL) {
        await mongoose.connect(URL);
    }

    async getMessages(room, page=1, messagesPerPage=100) {
        const roomId = await this.getRoomIdByName(room);
        const messages = await this._Message.find({room: roomId}).sort({_id: -1}).limit(page*messagesPerPage);
        return messages.slice((page-1)*messagesPerPage);
    }

    async addUser(user) {
        const userDocument = new this._User(user);
        const success = await userDocument.save((err, user) => {
            if (err) return null;
            return user;
        })
        return success;
    }

    async getUser(login) {
        return await this._User.findOne({login});
    }

    async getUsers() {
        return await this._User.find({});
    }


    async _init() {
        if (!(await this._Room.findOne({name:"General"}))){
            await this._Room.insertMany([
                {
                    name: "General"
                }
            ])
            console.log("Created room 'General'");
        }
            
        if (!(await this._User.findOne({login:"admin"}))){
            await this._User.insertMany([
                {
                    login: "admin",
                    password: "admin"
                }
            ])
            console.log("Created user 'admin'");
        }
            
    }
} 

module.exports = Database;