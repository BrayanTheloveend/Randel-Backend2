const mongoose = require('mongoose')

const systemScheme = new mongoose.Schema({

    amount: {
        type: Number,
        default: 0
    },
    password: String

},{collection: 'systems'});
module.exports = mongoose.models.systems ||   mongoose.model('systems', systemScheme);