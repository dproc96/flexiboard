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

    app.post("/api/v1/boards/:boardId", auth, (req, res) => {
        db.Board.fetchBoard(req.params.boardId).then(board => {
            let forbidden = true
            board.users.forEach(user => {
                if (user._id === mongoose.Types.ObjectId(req.user)) { forbidden: false }
            })
            if (forbidden) { res.status(403).send({ error: "Access forbidden" }) }
            db.Board.updateBoard(req.params.boardId, req.body).then(results => {
                res.status(200).send()
            }).catch(e => {
                res.status(503).end()
            })
        }).catch(e => {
            res.status(404).send({ error: "Board not found" })
        }) 
    })

    app.post("/api/v1/boards/new", auth, (req, res) => {
        db.Board.newBoard(req.body, req.user).then(results => {
            res.status(200).send()
        }).catch(e => {
            res.status(503).end()
        })
    })
}