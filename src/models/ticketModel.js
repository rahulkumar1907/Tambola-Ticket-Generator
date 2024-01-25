const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    setNumber: {
        type: Number,
        require: true
    },
    ticketData: {
        type: Array,
        require: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);

