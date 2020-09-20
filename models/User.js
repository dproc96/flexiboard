const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    boards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board"
    }],
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    cards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Card"
    }]
})

UserSchema.methods.generateAuthToken = async () => {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_KEY);
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}

UserSchema.methods.findByCredentials = async (email, password) => {
    User.findOne({email}).then(user => {
        const isMatch = bcrypt.compareSync(password, user.password)

        if (!isMatch) { throw new Error("Password not correct")}
        return user
    }).catch(e => {
        throw new Error("User not found")
    })
}

UserSchema.pre("save", async next => {
    const user = this;
    if (user.isModified("password")) {
        user.password = bcrypt.hashSync(user.password)
    }
    next()
})

const User = mongoose.model("User", UserSchema)

module.exports = User;