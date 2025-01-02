const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: String,
    role: String,
    phone: String,
    email: String,
    lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true }, // Associate with a lead
});

module.exports = mongoose.model('Contact', contactSchema);
