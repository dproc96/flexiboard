const db = require("../models");
const auth = require("../middleware/auth");

module.exports = app => {
    app.post("/users/register", async (req, res) => {
        const user = new db.User(req.body)
        try {
            await user.save()
            const token = await user.generateAuthToken()
            res.status(201).send({ user, token })
        }
        catch (e) {
            res.status(400).send(e)
        }
    })

    app.post("/users/login", async (req, res) => {
        db.User.findByCredentials(req.body.email, req.body.password).then(async user => {
            const token = await user.generateAuthToken()
            res.status(200).send({ user, token })
        }).catch(e => {
            console.log(e)
            res.status(400).end()
        })
    })

    app.post("/users/logout", async (req, res) => {
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

    app.get("/users/me", auth, async (req, res) => {
        db.User.findById(req.user).populate("boards").populate("cards").then(user => {
            res.json(user)
        }).catch(e => {
            res.status(503).send(e)
        })
    })

    app.put("/users", auth, async (req, res) => {    
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