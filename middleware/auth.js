const jwt = require("jsonwebtoken")
const db = require("../models")

module.exports = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "")
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        getUserFromToken(decoded, req, token, next, res)
    }
    catch (e) {
        res.status(401).send({ error: "User is not authenticated" })
    }
}

function getUserFromToken(decoded, req, token, next, res) {
    db.User.findById(decoded._id).then(user => {
        req.token = token
        req.user = user._id
        next()
    }).catch(e => {
        console.log(e)
        res.status(400).send()
    })
}
