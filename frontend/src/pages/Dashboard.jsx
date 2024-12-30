import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import TransactionSummary from "../components/TransactionSummary";
import TransactionTable from "../components/TransactionTable";
import DataVisualization from "../components/DataVisualization";
import TransactionModal from "../components/TransactionModal";

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState("");

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
                setFilteredTransactions(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    useEffect(() => {
        if (search) {
            const filtered = transactions.filter(
                (transaction) =>
                    transaction.description.toLowerCase().includes(search.toLowerCase()) ||
                    transaction.category.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredTransactions(filtered);
        } else {
            setFilteredTransactions(transactions);
        }
    }, [search, transactions]);

    const handleAddTransaction = (newTransaction) => {
        setTransactions((prev) => [...prev, newTransaction]);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Your Dashboard</h1>
            </header>

            <div className="dashboard-summary">
                <TransactionSummary transactions={transactions} />
            </div>

            <div className="dashboard-actions">
                <button
                    className="add-transaction-button"
                    onClick={() => setIsModalOpen(true)}
                >
                    Add Transaction
                </button>
                <input
                    type="text"
                    placeholder="Search by description or category"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="dashboard-visualization">
                <DataVisualization transactions={filteredTransactions} />
            </div>

            <div className="dashboard-table">
                {filteredTransactions.length > 0 ? (
                    <TransactionTable
                        transactions={filteredTransactions}
                    />
                ) : (
                    <p className="no-transactions">No transactions found.</p>
                )}
            </div>

            {isModalOpen && (
                <TransactionModal
                    onClose={() => setIsModalOpen(false)}
                    onAddTransaction={handleAddTransaction}
                />
            )}
        </div>
    );
};

export default Dashboard;
