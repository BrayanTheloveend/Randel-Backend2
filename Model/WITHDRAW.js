const mongoose = require('mongoose')

const withdrawSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    owner: String,
    amount: {
        type: Number,
        required: true
    },
    email: String,
    phone: String,
    cni: String,
    statut: String,
    picture: String,
    createdAt: Date


},{collection: 'withdraw'});
module.exports = mongoose.models.withdraw ||  mongoose.model('withdraw', withdrawSchema);