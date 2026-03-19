const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        required: [true, 'Category is required']
    },
    limit: {
        type: Number,
        required: [true, 'Budget limit is required'],
        min: [0, 'Limit cannot be negative']
    },
    month: {
        type: String,
        required: [true, 'Month is required'],
        match: [/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format']
    }
}, { timestamps: true });

budgetSchema.index({ user: 1, category: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
