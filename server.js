const http = require("http");
const ws = require("ws");
const express = require("express");
const bcrypt = require("bcryptjs");
const { login, password, ip } = require("./config");
const cors = require("cors");
const authRouter = require("./routers/auth/authRouter");
const Database = require("./database/Database");


const PORT = process.env.PORT || 8000;

const expressServer = express()
const htmlServer = http.createServer(expressServer);
const wsServer = new ws.Server({ server: htmlServer });

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
} 

expressServer.use(cors(corsOptions));
expressServer.use(express.json())
expressServer.use("/auth", authRouter);

expressServer.listen(PORT, async () => {
    console.log("Server started at PORT ", PORT)
    const database = new Database(`mongodb://${login}:${password}@${ip}:27017/chat`);
    console.log(await database.getUsers())
})
