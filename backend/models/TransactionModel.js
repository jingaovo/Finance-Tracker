const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: [true, 'Please add an amount'],
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
    },
    date: {
        type: Date,
        default: Date.now,
    },
    description: {
        type: String,
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: [true, 'Please specify a type']
    },
}, {
    timestamps: true,
})

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;