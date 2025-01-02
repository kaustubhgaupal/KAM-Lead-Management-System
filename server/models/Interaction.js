const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
    type: { type: String, enum: ['Call', 'Email', 'Meeting'], required: true },
    date: { type: Date, default: Date.now },
    notes: { type: String, maxlength: 1000 },
    lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true }
});

module.exports = mongoose.model('Interaction', interactionSchema);
