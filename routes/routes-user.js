const db = require("../models")

module.exports = app => {
    app.post("/users", (req, res) => {
        db.User.create(req.body).then(results => {
            res.json(results)
        }).catch(err => {
            res.status(503).end(err.message);
        })
    })

    app.get("/users/:userid", (req, res) => {
        db.User.findOne({
            where: {
                id: req.params.userid
            }
        }).then(data => {
            if (!data) {res.status(404).end("User not found")}
            res.json(data)
        }).catch(err => {
            res.status(503).end(err.message)
        })
    })

    app.get("/users/:userid/boards", (req, res) => {
        db.User.findOne({
            include: db.Board,
            where: {
                id: req.params.userid
            }
        }).then(data => {
            if (!data) { res.status(404).end("User not found") }
            res.json(data)
        }).catch(err => {
            res.status(503).end(err.message)
        })
    })
}