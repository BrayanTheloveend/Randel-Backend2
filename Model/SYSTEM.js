const mongoose = require('mongoose')

const systemScheme = new mongoose.Schema({

    message: Array,
    earn:{
        type: Number,
        default: 0
    },
    solded: Number,
    password: String,
    soldedAmount: {
        type: Number,
        default: 0
    },
    createdAt: Date

},{collection: 'systems'});
module.exports = mongoose.models.systems ||   mongoose.model('systems', systemScheme);