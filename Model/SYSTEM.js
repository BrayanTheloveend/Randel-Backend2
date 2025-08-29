const mongoose = require('mongoose')

const systemScheme = new mongoose.Schema({

    message: Array,
    earn:{
        type: Number,
        default: 0
    },
    solded: Number,
    password: String,
    availableAmount: {
        type: Number,
        default: 0
    },

},{collection: 'systems'});
module.exports = mongoose.models.systems ||   mongoose.model('systems', systemScheme);