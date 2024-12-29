import React, { useState, useEffect } from "react";
import "./TransactionModal.css";

const TransactionModal = ({ onClose, onAddTransaction, transaction }) => {
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("income");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (transaction) {
            setAmount(transaction.amount);
            setCategory(transaction.category);
            setType(transaction.type);
            setDate(transaction.date.split("T")[0]); // Format date for input
            setDescription(transaction.description);
        }
    }, [transaction]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const token = localStorage.getItem("token");
            const url = transaction
                ? `http://localhost:5001/api/transactions/${transaction._id}`
                : "http://localhost:5001/api/transactions";

            const method = transaction ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ amount, category, date, description, type }),
            });

            if (!response.ok) {
                throw new Error(
                    transaction ? "Failed to update transaction" : "Failed to add transaction"
                );
            }

            const data = await response.json();
            onAddTransaction(data);
            onClose();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>{transaction ? "Edit Transaction" : "Add Transaction"}</h2>
                <form onSubmit={handleSubmit} className="transaction-form">
                    <input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    />
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        required
                    >
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="submit-button">
                        {transaction ? "Update" : "Add"}
                    </button>
                    <button type="button" className="cancel-button" onClick={onClose}>
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TransactionModal;
