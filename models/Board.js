const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Card = require("./Card");
const User = require("./User")

const BoardSchema = new Schema({
    title: {
        type: String,
        default: "Untitled Board"
    },
    cards: [{
        data: {
            type: Schema.Types.ObjectId,
            ref: "Card"
        },
        height: Number,
        width: Number,
        top: Number,
        left: Number,
        index: Number
    }],
    users: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }]
})

BoardSchema.statics.fetchBoard = async id => {
    return await Board.findById(id).populate("cards.data").populate("users").then(board => {
        board.cards.sort((a, b) => a.index - b.index)
        const cards = []
        // For whatever reason map function and direct editing didn't work but this did
        for (let card of board.cards) {
            let newCard = {
                title: card.data.title,
                body: card.data.body,
                width: card.width,
                height: card.height,
                top: card.top,
                left: card.left,
                _id: card.data._id
            }
            cards.push(newCard)
        }
        const users = []
        for (let user of board.users) {
            let newUser = {
                email: user.email,
                _id: user._id,
                name: user.name
            }
            users.push(newUser)
        }
        const output = {
            title: board.title,
            _id: board._id,
            cards: cards,
            users: users
        }
        return output
    }).catch(e => {
        throw new Error(e.message)
    })
}

BoardSchema.statics.updateBoard = async (id, boardData) => {
    const newCards = [];
    for (let card of boardData.cards) {
        if (card._id) {
            Card.findById(card._id).then(dbCard => {
                dbCard.title = card.title
                dbCard.body = card.body
                dbCard.save()
            }).catch(e => {
                throw new Error(e.message)
            })
        }
        else {
            newCards.push(card)
            card.newCardIndex = newCards.length
        }
    }
    return await Card.insertMany(newCards).then(async cards => {
        boardData.cards = boardData.cards.map((card, i) => {
            card.data = card.newCardIndex ? cards[card.newCardIndex - 1]._id : card._id
            card.index = i
            delete card.title
            delete card.body
            delete card._id
            delete card.newCardIndex
            return card
        })
        return await Board.findById(id).then(async dbBoard => {
            dbBoard.title = boardData.title
            dbBoard.cards = boardData.cards
            boardData.users.forEach(user => {
                User.findById(user._id).then(user => {
                    if (dbBoard.users.indexOf(user._id) === -1) {
                        dbBoard.users.push(user._id)
                        user.boards.push(dbBoard._id)
                    }
                    dbBoard.cards.forEach(card => {
                        if (user.cards.indexOf(card.data) === -1) {
                            user.cards.push(card.data)
                            Card.findById(card.data).then(dbCard => {
                                if (dbCard.users.indexOf(user._id) === -1) {
                                    dbCard.users.push(user._id)
                                    dbCard.save()
                                }
                            })
                        }
                    })
                    user.save()
                })
            })
            return await dbBoard.save().then(result => result)
        }).catch(e => {
            throw new Error(e.message)
        })
    }).catch(e => {
        throw new Error(e.message)
    })
}

BoardSchema.statics.newBoard = async (boardData, userId) => {
    return await Card.insertMany(boardData.cards).then(async cards => {
        const board = {
            title: boardData.title,
            cards: boardData.cards.map((card, i) => {
                card.data = cards[i]._id
                card.index = i
                delete card.title
                delete card.body
                return card
            }),
            users: [mongoose.Types.ObjectId(userId)]
        }
        return await Board.create(board).then(result => {
            User.findById(userId).then(user => {
                user.boards.push(result._id)
                cards.forEach(card => {
                    if (user.cards.indexOf(card._id) === -1) {
                        user.cards.push(card._id)
                        Card.findById(card._id).then(dbCard => {
                            if (dbCard.users.indexOf(user._id) === -1) {
                                dbCard.users.push(user._id)
                                dbCard.save()
                            }
                        })
                    }
                })
                user.save()
            })
            return result
        }).catch(e => {
            throw new Error(e.message)
        })
    }).catch(e => {
        throw new Error(e.message)
    })
}

const Board = mongoose.model("Board", BoardSchema)

module.exports = Board