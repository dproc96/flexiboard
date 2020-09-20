const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const UserSchema = new Schema({
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
        type: Schema.Types.ObjectId,
        ref: "Board"
    }],
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    cards: [{
        type: Schema.Types.ObjectId,
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

UserSchema.statics.findByCredentials = async (email, password) => {
    User.findOne({email}).then(user => {
        const isMatch = bcrypt.compareSync(password, user.password)

        if (!isMatch) { throw new Error("Password not correct")}
        return user
    }).catch(e => {
        throw new Error("User not found")
    })
}

UserSchema.pre("save", function(next) {
    const user = this;
    if (user.isModified("password")) {
        user.password = bcrypt.hashSync(user.password)
    }
    next()
})

const User = mongoose.model("User", UserSchema)

module.exports = User;