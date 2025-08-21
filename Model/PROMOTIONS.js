const mongoose = require('mongoose')

const PromoSchema = new mongoose.Schema({

    picture: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    createdAt: Date


},{collection: 'orders'});
module.exports = mongoose.models.orders ||  mongoose.model('orders', PromoSchema);