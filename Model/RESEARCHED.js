const mongoose = require('mongoose')

const ResearchedSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    attachement: String,
    createAt: Date


},{collection: 'history'});
module.exports = mongoose.models.history ||  mongoose.model('history', ResearchedSchema);