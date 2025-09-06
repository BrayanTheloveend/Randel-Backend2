const mongoose = require('mongoose')

const payoutSchema = new mongoose.Schema({
    name: String,
    email: String,
    amount: {
        type: Number,
        required: true
    },
    cni: String,
    statut: String,
    picture: String,
    createdAt: Date


},{collection: 'payout'});
module.exports = mongoose.models.payout ||  mongoose.model('payout', payoutSchema);