const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    blocked: {
        type: Boolean,
        required: false,
        default: false
    },
    picture: String,
    statut: Boolean,
    CodeOtp: String,
    role: {
        type: String,
        require: false,
        default: 'Visitor'
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: String,

},{collection: 'users'});
module.exports = mongoose.models.users ||   mongoose.model('users', userSchema);