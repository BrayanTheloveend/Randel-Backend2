const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({

    amount: Number,
    customerId: String,
    order: Array,
    code: String,
    name: String,
    delivreryAddress: String,
    phone: String,
    picture: String,
    verify: {
        type: Boolean,
        default: false
    },
    statut: {
        type: String,
        default: 'En attente'
    },


},{collection: 'orders'});
module.exports = mongoose.models.orders ||  mongoose.model('orders', OrderSchema);