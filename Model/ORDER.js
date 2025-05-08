const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({

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
    order: Array,
    picture: String,


},{collection: 'orders'});
module.exports = mongoose.models.orders ||  mongoose.model('orders', OrderSchema);