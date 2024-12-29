import React from "react";
import "./TransactionSummary.css";

const TransactionSummary = ({ transactions }) => {
    const totalIncome = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    return (
        <div className="transaction-summary">
            <div className="summary-item">
                <span>Total Income:</span> <span>${totalIncome.toFixed(2)}</span>
            </div>
            <div className="summary-item">
                <span>Total Expenses:</span> <span>${totalExpenses.toFixed(2)}</span>
            </div>
            <div className="summary-item">
                <span>Balance:</span> <span>${balance.toFixed(2)}</span>
            </div>
        </div>
    );
};

export default TransactionSummary;
