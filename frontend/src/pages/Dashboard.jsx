import React, { useEffect, useState } from "react";
import "./Dashboard.css";

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("http://localhost:5001/api/transactions", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch transactions");
                }

                const data = await response.json();
                setTransactions(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="dashboard">
            <h1 className="dashboard-title">Dashboard</h1>
            <TransactionSummary transactions={transactions} />
            {transactions.length > 0 ? (
                <TransactionTable transactions={transactions} />
            ) : (
                <p className="no-transactions">No transactions yet. Add your first transaction!</p>
            )}
        </div>
    );
};

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

const TransactionTable = ({ transactions }) => {
    return (
        <table className="transaction-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th>Amount</th>
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
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Dashboard;