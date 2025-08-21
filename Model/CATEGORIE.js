const mongoose = require('mongoose')

const categorieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: false
    },
    article: [],
    picture: {
        type: String,
        required: false
    },
    createdAt: Date


},{collection: 'categorie'});
module.exports = mongoose.models.categorie ||  mongoose.model('categorie', categorieSchema);