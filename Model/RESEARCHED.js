const mongoose = require('mongoose')

const ResearchedSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    attachement: String,
    createAt: Date


},{collection: 'orders'});
module.exports = mongoose.models.orders ||  mongoose.model('orders', ResearchedSchema);