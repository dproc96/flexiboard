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
mongoose.connection.dropDatabase()
db.User.create({
    email: "test@test.com",
    password: "testuser",
    name: "Test User"
}).then(user => {
    db.Board.newBoard({
        title: "Test Board",
        cards: [{
            title: "Test",
            body: "This is a test card",
            width: 500,
            height: 300,
            top: 100,
            left: 100
        }]
    }, user._id).then(board => {
        db.Board.fetchBoard(board._id).then(result => {
            console.log(result)
            result.cards.push({
                title: "Test 2",
                body: "This is a second test card",
                width: 400,
                height: 300,
                top: 100,
                left: 100
            })
        })
    })
})



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/client/build'))

router(app);


const server = http.createServer(app)
const io = require("socket.io")(server)
io.on("connection", socket => {
    socket.on("new board", board => {
        socket.join(board)
    })
    socket.on("new connection", board => {
        socket.join(board)
        socket.to(board).emit("new user")
    })
    socket.on("update", (board, cards) => {
        socket.to(board).emit("update", cards)
    })
})

console.log(app._router.stack)
server.listen(PORT, () => {
    console.log(`🌎 ==> API server now on port ${PORT}!`);
})