const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    restaurantName: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, match: /^\+?\d{10,15}$/ },
    website: { type: String, match: /^(https?:\/\/)?[\w\-]+(\.[\w\-]+)+[/#?]?.*$/ },
    status: { 
        type: String, 
        enum: ['New', 'Contacted', 'In Progress', 'Closed'], 
        default: 'New' 
    },

    callFrequency: { type: Number, default: 7 }, // Frequency in days
    lastCall: { type: Date },
    performanceScore: { type: Number, default: 0 }, // Performance metric


    
    KAM: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    notes: { type: String, default: '' },
    contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }],
    interactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Interaction' }]
}, { timestamps: true });

leadSchema.index({ KAM: 1 });
leadSchema.index({ status: 1 });

leadSchema.virtual('interactionCount').get(function () {
    return this.interactions.length;
});

leadSchema.methods.addNote = function(note) {
    this.notes += `\n${note}`;
    return this.save();
};

leadSchema.statics.findByKAM = function(KAMId) {
    return this.find({ KAM: KAMId });
};

module.exports = mongoose.model('Lead', leadSchema);
