const db = require("../models")
const auth = require("../middleware/auth")
const mongoose = require("mongoose")

module.exports = app => {
    app.get("/api/v1/boards/:boardId", auth, (req, res) => {
        db.Board.fetchBoard(req.params.boardId).then(board => {
            db.User.findById(req.user).then(user => {
                const permitted = user.boards.indexOf(board._id) > -1
                if (!permitted) { res.status(403).send({ error: "Access forbidden" })}
                else {
                    res.json(board)
                }
            })
        }).catch(e => {
            res.status(404).send()
        })
    })

    app.post("/api/v1/boards/update/:boardId", auth, (req, res) => {
        db.Board.fetchBoard(req.params.boardId).then(board => {
            sendForbiddenResponseIfUserNotPermitted(board, req, res)
            updateBoard(req, res)
        }).catch(e => {
            res.status(404).send({ error: "Board not found" })
        }) 
    })

    app.post("/api/v1/boards/create", auth, (req, res) => {
        db.Board.newBoard(req.body, req.user).then(results => {
            res.status(200).json(results)
        }).catch(e => {
            console.log(e)
            res.status(503).end()
        })
    })
}

function sendForbiddenResponseIfUserNotPermitted(board, req, res) {
    let hasPermission = verifyUserPermissions(board, req)
    if (!hasPermission) { res.status(403).send({ error: "Access forbidden" })} 
}

function updateBoard(req, res) {
    db.Board.updateBoard(req.params.boardId, req.body).then(results => {
        res.status(200).send()
    }).catch(e => {
        res.status(503).end()
    })
}

function verifyUserPermissions(board, req) {
    board.users.forEach(user => {
        if (user._id === mongoose.Types.ObjectId(req.user)) { return true } 
    })
    return false
}
