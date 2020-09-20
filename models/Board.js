const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Card = require("./Card");
const { cadetblue } = require('color-name');

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
    return await Board.findById(id).populate("cards.data").then(board => {
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
        const output = {
            title: board.title,
            _id: board._id,
            cards: cards
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
                if (dbCard.boards.indexOf(mongoose.Types.ObjectId(id)) === -1) {
                    dbCard.boards.push(mongoose.Types.ObjectId(id))
                }
                boardData.users.forEach(user => {
                    if (dbCard.users.indexOf(mongoose.Types.ObjectId(user._id)) === -1) {
                        dbCard.users.push(mongoose.Types.ObjectId(user._id))
                    }
                })
                dbCard.title = card.title
                dbCard.body = card.body
                dbCard.save()
            }).catch(e => {
                throw new Error(e.message)
            })
        }
        else {
            newCards.push(card)
            card.newCardIndex = newCards.length - 1
        }
    }
    return await Card.insertMany(newCards).then(async cards => {
        boardData.cards = boardData.cards.map((card, i) => {
                card.data = card.newCardIndex ? cards[card.newCardIndex]._id : card._id
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