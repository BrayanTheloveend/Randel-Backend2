const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({

    amount: Number,
    customerId: String,
    order: Array,
    code: String,
    email: String,
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
    createdAt: Date


},{collection: 'orders'});
module.exports = mongoose.models.orders ||  mongoose.model('orders', OrderSchema);