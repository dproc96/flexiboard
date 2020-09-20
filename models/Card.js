const mongoose = require("mongoose")
const Schema = mongoose.Schema

const CardSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }]
})

const Card = mongoose.model("Card", CardSchema)

module.exports = Card;