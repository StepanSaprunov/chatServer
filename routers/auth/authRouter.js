const Database = require("../../database/Database");
const { login, password, ip } = require("../../config");
const bcrypt = require("bcryptjs");
const express = require("express");

const router = new express.Router();
database = new Database(`mongodb://${login}:${password}@${ip}:27017/chat`);




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

}

const isUserExist = async (req, res) => {
    const login = req.params.user;
    console.log(login, typeof login);
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