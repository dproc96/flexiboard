const express = require("express");
const http = require("http");
require("dotenv").config()
const PORT = process.env.PORT || 3001;
const router = require("./routes");
const mongoose = require("mongoose");
const uri = process.env.MONGODB_URI;
const db = require("./models");

const app = express()

mongoose.connect(uri, {useNewUrlParser: true})
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
        console.log("Board: " + board)
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
        var room = io.sockets.adapter.rooms[board]
        if (room && room.length > 0) {
            db.Board.updateBoard(board, boards[board])
        }
        else {
            delete boards[board]
        }
    }
}, 10)

server.listen(PORT, () => {
    console.log(`🌎 ==> API server now on port ${PORT}!`);
})