const mongoose = require('mongoose')

const PromoSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    provider: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    description: String,
    picture: String,
    stock: Number,
    price: String,
    oldPrice: String,
    country: String,
    build: String,
    createdAt: Date


},{collection: 'promotion'});
module.exports = mongoose.models.promotion ||  mongoose.model('promotion', PromoSchema);