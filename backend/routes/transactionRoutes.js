const express = require("express");
const Transaction = require('../models/TransactionModel');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
router.use(authMiddleware);

// Create a new transaction
router.post('/', async (req, res) => {
    const { amount, category, date, description, type } = req.body;
    try {
        const transaction = new Transaction({ user: req.user.id, amount, category, date, description, type });
        await transaction.save();
        res.status(201).json(transaction);
    } catch (error) {
        res.status(400).json({ message: 'Error creating transaction'})
    }
});

// Get all transactions
router.get('/', async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transactions', error: error.message });
    }
});

// Update a transaction
router.put('/:id', async (req, res) => {
    try {
        const updatedTransaction = await Transaction.findOneAndUpdate(
            {_id: req.params.id, user: req.user.id}, req.body, { new: true, runValoidators: true }
        );
        if (!updatedTransaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.status(200).json(updatedTransaction);
    } catch (error) {
        res.status(400).json({ message: "Error updating transaction", error: error.message });
    }
});

// Delete a transaction
router.delete('/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({_id: req.params.id, user: req.user.id});
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting transaction", error: error.message });
    }
});

module.exports = router;
