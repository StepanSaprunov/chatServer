const Database = require("../../database/Database");
const { login, password, ip, key } = require("../../config");
const bcrypt = require("bcryptjs");
const express = require("express");
const jwt = require("jsonwebtoken");

const router = new express.Router();
database = new Database(`mongodb://${login}:${password}@${ip}:27017/chat`);


const createToken = (data) => {
    return jwt.sign(data, key, {
        expiresIn: "12h"
    })
}


const registration = async (req, res) => {
    try {
        const { login, password } = req.body;
        if (!(await database.isUserExist({login}))) {
            await database.addUser({
                login,
                password: bcrypt.hashSync(password, 7)
            });
            if (await database.isUserExist({login})) return res.status(200).json({
                message: "Registration succeed"
            })
            else return res.status(400).json({
                message: "Registration failed. DB error"
            })
        }
        else return res.status(400).json({
            message: "Registration failed. User already exist"
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: "Registration failed. Unexpeted error"
        })
    }
}

const signIn = async (req, res) => {
    try {
        const { login, password } = req.body;
        const user = await database.getUserByLogin(login);
        if (!user) {
            return res.status(400).json({
                message: "User not found"
            })
        }
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) 
            return res.status(400).json({
                message: "Password incorrect"
            })
        const token = createToken({_id: user._id, roles: user.roles});
        return res.json(token);
    } catch (error) {
        
    }
}

const isUserExist = async (req, res) => {
    const login = req.params.user;
    const isUserExist = await database.isUserExist({login});
    if (isUserExist) {
        return res.status(400).json({
            message: "User is exist"
        })
    }
    else {
        return res.status(200).json({
            message: "User is not exist"
        })
    }
}

router.post("/registration", registration);
router.get("/user/:user", isUserExist)


module.exports = router;