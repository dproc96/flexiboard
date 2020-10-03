const express = require("express");
const http = require("http");
require("dotenv").config()
const PORT = process.env.PORT || 3001;
const router = require("./routes");
const mongoose = require("mongoose");
const uri = process.env.MONGODB_URI;
const db = require("./models");

const app = express()

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology:true, useCreateIndex: true})
mongoose.connection.useDb("flexiboard")



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/client/build'))

router(app);


const server = http.createServer(app)
const io = require("socket.io")(server)
const boards = {}
io.on("connection", socket => {
    socket.on("new connection", board => {
        socket.join(board)
        socket.to(board).emit("new user")
    })
    socket.on("update", (board, data) => {
        boards[board] = data
        socket.to(board).emit("update", data)
    })
})

const interval = setInterval(() => {
    for (let board in boards) {
        let room = io.sockets.adapter.rooms[board]
        let roomHasActiveMembers = room && room.length > 0
        if (roomHasActiveMembers) {
            db.Board.updateBoard(board, boards[board])
        }
        else {
            delete boards[board]
        }
    }
}, 100)

server.listen(PORT, () => {
    console.log(`🌎 ==> API server now on port ${PORT}!`);
})