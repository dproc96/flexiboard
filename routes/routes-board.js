const db = require('../models');

module.exports = app => {
    app.post('/boards', (req, res) => {
        db.Board.create({name: req.body.name, UserId: req.body.UserId}).then(results => {
            db.UserBoard.create({UserId: req.body.UserId, BoardId: results.BoardId}).then(resultsUserBoard => {
                res.send({...results, ...resultsUserBoard})
            })
        }).catch(error => {
            res.status(503).send(error)
        })
    })

    app.get('/boards/:boardid', (req, res) => {
        db.Board.findOne({
            include: db.User,
            where: {
                id: req.params.boardid
            }
        }).then(results => {
            res.send(results)
        }).catch(error => {
            res.status(503).send(error)
        })
    })
}