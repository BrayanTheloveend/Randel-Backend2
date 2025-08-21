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
        required: false
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
        default: 'Client'
    },
    password: {
        type: String,
        required: true
    },
    description: String,
    shopName: String,
    account: {type: Number, default: 0},
    solded: {type: Number, default: 0},
    posted: {type: Number, default: 0},
    phone: String,
    facebook: String,
    tiktok: String,
    history: Array,
    country: {type: String, default: 'Cameroun'},
    city: {type: String, default: 'Yaoundé'},
    refreshToken: String,

},{collection: 'users'});
module.exports = mongoose.models.users ||   mongoose.model('users', userSchema);