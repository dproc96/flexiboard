const db = require("../models");
const auth = require("../middleware/auth");

module.exports = app => {
    app.post("/api/v1/users/register", async (req, res) => {
        const user = new db.User(req.body.user)
        try {
            await user.save()
            const token = await user.generateAuthToken()
            db.Board.newBoard(req.body.board, user._id).then(board => {
                res.status(200).send({user, token, board})
            }).catch(e => {
                console.log(e)
                res.status(503).end()
            })
        }
        catch (e) {
            res.status(400).send(e)
        }
    })

    app.post("/api/v1/users/login", async (req, res) => {
        db.User.findByCredentials(req.body.email, req.body.password).then(async user => {
            const token = await user.generateAuthToken()
            res.status(200).send({ user, token })
        }).catch(e => {
            console.log(e)
            res.status(400).end()
        })
    })

    app.post("/api/v1/users/logout", async (req, res) => {
        try {
            req.user.tokens = req.user.tokens.filter(token => {
                return token.token !== req.token
            })
            await req.user.save()
            res.send()
        } catch (error) {
            res.status(500).end()
        }
    })

    app.get("/api/v1/users/me", auth, async (req, res) => {
        db.User.findById(req.user).populate("boards").populate("cards").then(user => {
            res.json(user)
        }).catch(e => {
            res.status(503).send(e)
        })
    })

    app.put("/api/v1/users", auth, async (req, res) => {    
        for (let key in req.body) {
            if (req.user.hasOwnProperty(key)) {
                req.user[key] = req.body[key]
            }
            req.user.save().then(result => {
                res.json(result)
            }).catch(e => {
                res.status(503).send(e)
            })
        }
    })
}