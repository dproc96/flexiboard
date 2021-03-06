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
}, {timestamps: true})

BoardSchema.statics.fetchBoard = async id => {
    return await Board.findById(id).populate("cards.data").populate("users").then(board => {
        sortCardsByIndex(board);

        // For whatever reason map function and direct editing didn't work but this did
        const cards = []
        cleanUpCardData(board, cards);

        const users = []
        cleanUpUserData(board, users);

        return {
            title: board.title,
            _id: board._id,
            cards: cards,
            users: users,
            createdAt: board.createdAt,
            updatedAt: board.updatedAt
        }
    }).catch(e => {
        console.log(e)
    })
}

BoardSchema.statics.updateBoard = async (id, board) => {
    const boardData = {
        title: board.title,
        cards: []
    }
    const newCards = [];
    const cards = []

    processCardsFromBoard(board, boardData, cards);

    checkForNewCards(cards, boardData, newCards);

    if (newCards.length) {
        return await createNewCardsAndUpdateBoard(newCards, boardData, id)
    }
    else {
        return await updateBoard(id, boardData)
    }
}

BoardSchema.statics.newBoard = async (boardData, userId) => {
    return await createCardsAndBoard(boardData, userId)
}

const Board = mongoose.model("Board", BoardSchema)

module.exports = Board

async function createCardsAndBoard(boardData, userId) {
    return await Card.insertMany(boardData.cards).then(async (cards) => {
        return createBoard(boardData, cards, userId);
    }).catch(e => {
        console.log(e);
    });
}

async function createBoard(boardData, cards, userId) {
    const board = {
        title: boardData.title,
        cards: boardData.cards.map((card, i) => {
            card.data = cards[i]._id;
            card.index = i;
            delete card.title;
            delete card.body;
            return card;
        }),
        users: [mongoose.Types.ObjectId(userId)]
    };
    return await Board.create(board).then(result => {
        addBoardToUser(userId, result, cards);
        return result;
    }).catch(e => {
        console.log(e);
    });
}

function addBoardToUser(userId, result, cards) {
    User.findById(userId).then(user => {
        user.boards.push(result._id);
        addCardsToUser(cards, user);
        user.save();
    });
}

function addCardsToUser(cards, user) {
    cards.forEach(card => {
        if (user.cards.indexOf(card._id) === -1) {
            user.cards.push(card._id);
            addUserToCard(card._id, user);
        }
    });
}

function addUserToCard(id, user) {
    Card.findById(id).then(card => {
        if (card.users.indexOf(user._id) === -1) {
            card.users.push(user._id);
            card.save();
        }
    });
}

async function updateBoard(id, boardData) {
    return await Board.findById(id).then(async (dbBoard) => {
        dbBoard.title = boardData.title;
        dbBoard.cards = boardData.cards;
        if (boardData.users) {
            addBoardToNewUsers(boardData, dbBoard);
        }
        return await dbBoard.save().then(result => result);
    }).catch(e => {
        console.log(e);
    });
}

async function createNewCardsAndUpdateBoard(newCards, boardData, id) {
    return await Card.insertMany(newCards).then(async (cards) => {
        addNewlyCreatedCardIdsToBoard(boardData, cards);
        return await updateBoard(id, boardData);
    }).catch(e => {
        console.log(e);
    });
}

function addBoardToNewUsers(boardData, dbBoard) {
    boardData.users.forEach(user => {
        addBoardToNewUser(user, dbBoard);
    });
}

function addBoardToNewUser(user, dbBoard) {
    User.findById(user._id).then(user => {
        establishNewUserLinkages(dbBoard, user);
        user.save();
    });
}

function establishNewUserLinkages(dbBoard, user) {
    if (dbBoard.users.indexOf(user._id) === -1) {
        linkUserAndBoard(user, dbBoard);
    }
    dbBoard.cards.forEach(card => {
        linkUserAndCards(user, card);
    });
}

function linkUserAndCards(user, card) {
    if (user.cards.indexOf(card.data) === -1) {
        user.cards.push(card.data);
        addUserToCard(card.data, user);
    }
}

function linkUserAndBoard(dbBoard, user) {
    dbBoard.users.push(user._id);
    user.boards.push(dbBoard._id);
}

function addNewlyCreatedCardIdsToBoard(boardData, cards) {
    boardData.cards = boardData.cards.map((card, i) => {
        card.data = card.newCardIndex ? cards[card.newCardIndex - 1]._id : card.data;
        card.index = i;
        delete card.newCardIndex;
        return card;
    });
}

function checkForNewCards(cards, boardData, newCards) {
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const boardCard = boardData.cards[i];
        if (card.id) {
            updateCard(card);
        }
        else {
            newCards.push(card);
            boardCard.newCardIndex = newCards.length;
        }
    }
}

function updateCard(card) {
    Card.findById(card.id).then(dbCard => {
        dbCard.title = card.title;
        dbCard.body = card.body;
        dbCard.save();
    }).catch(e => {
        console.log(e);
    });
}

function processCardsFromBoard(board, boardData, cards) {
    board.cards.forEach(card => {
        const cardForDB = {
            title: card.title,
            body: card.body,
            id: card.id
        };
        const cardForBoard = {
            width: card.width,
            height: card.height,
            top: card.top,
            left: card.left,
            data: card.id
        };
        boardData.cards.push(cardForBoard);
        cards.push(cardForDB);
    });
}

function sortCardsByIndex(board) {
    board.cards.sort((a, b) => a.index - b.index);
}

function cleanUpUserData(board, users) {
    for (let user of board.users) {
        let newUser = {
            email: user.email,
            _id: user._id,
            name: user.name
        };
        users.push(newUser);
    }
}

function cleanUpCardData(board, cards) {
    for (let card of board.cards) {
        let newCard = {
            title: card.data.title,
            body: card.data.body,
            width: card.width,
            height: card.height,
            top: card.top,
            left: card.left,
            id: card.data._id
        };
        cards.push(newCard);
    }
}
