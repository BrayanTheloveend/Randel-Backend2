const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
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
    rate: Number,
    price: String,
    country: String,
    build: String,
    createdAt: Date


},{collection: 'articles'});
module.exports = mongoose.models.articles ||  mongoose.model('articles', articleSchema);