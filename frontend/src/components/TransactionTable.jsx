import React, { useState } from "react";
import "./TransactionTable.css";

const TransactionTable = ({ transactions, onEdit, onDelete }) => {
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const handleEditClick = (transaction) => {
        setSelectedTransaction(transaction);
        onEdit(transaction); 
    };

    return (
        <table className="transaction-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {transactions.map((transaction) => (
                    <tr key={transaction._id}>
                        <td>{new Date(transaction.date).toLocaleDateString()}</td>
                        <td>{transaction.category}</td>
                        <td>{transaction.description}</td>
                        <td>{transaction.type}</td>
                        <td>${transaction.amount.toFixed(2)}</td>
                        <td>
                            <button
                                className="edit-button"
                                onClick={() => handleEditClick(transaction)}
                            >
                                Edit
                            </button>
                            <button
                                className="delete-button"
                                onClick={() => onDelete(transaction._id)}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default TransactionTable;
