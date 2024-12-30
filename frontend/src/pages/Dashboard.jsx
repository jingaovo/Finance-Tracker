import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import TransactionSummary from "../components/TransactionSummary";
import TransactionTable from "../components/TransactionTable";
import TransactionModal from "../components/TransactionModal";

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [type, setType] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [minAmount, setMinAmount] = useState("");
    const [maxAmount, setMaxAmount] = useState("");

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
                setFilteredTransactions(data); // Initialize filtered transactions
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    useEffect(() => {
        // Apply filters whenever the filter criteria change
        let filtered = transactions;

        // Filter by search
        if (search) {
            filtered = filtered.filter(
                (transaction) =>
                    transaction.description.toLowerCase().includes(search.toLowerCase()) ||
                    transaction.category.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Filter by type
        if (type !== "all") {
            filtered = filtered.filter((transaction) => transaction.type === type);
        }

        // Filter by date range
        if (startDate) {
            filtered = filtered.filter(
                (transaction) => new Date(transaction.date) >= new Date(startDate)
            );
        }
        if (endDate) {
            filtered = filtered.filter(
                (transaction) => new Date(transaction.date) <= new Date(endDate)
            );
        }

        // Filter by amount range
        if (minAmount) {
            filtered = filtered.filter((transaction) => transaction.amount >= parseFloat(minAmount));
        }
        if (maxAmount) {
            filtered = filtered.filter((transaction) => transaction.amount <= parseFloat(maxAmount));
        }

        setFilteredTransactions(filtered);
    }, [search, type, startDate, endDate, minAmount, maxAmount, transactions]);

    const handleAddTransaction = (newTransaction) => {
        setTransactions((prev) => [...prev, newTransaction]);
    };

    const handleDeleteTransaction = async (transactionId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `http://localhost:5001/api/transactions/${transactionId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete transaction");
            }

            setTransactions((prev) =>
                prev.filter((transaction) => transaction._id !== transactionId)
            );
        } catch (err) {
            console.error("Error deleting transaction:", err.message);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="dashboard">
            <h1 className="dashboard-title">Your Dashboard</h1>
            <div className="filters">
                <input
                    type="text"
                    placeholder="Search by description or category"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="filter-input"
                />
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="filter-select"
                >
                    <option value="all">All</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="filter-input"
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="filter-input"
                />
                <input
                    type="number"
                    placeholder="Min Amount"
                    value={minAmount}
                    onChange={(e) => setMinAmount(e.target.value)}
                    className="filter-input"
                />
                <input
                    type="number"
                    placeholder="Max Amount"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e.target.value)}
                    className="filter-input"
                />
            </div>
            <button
                className="add-transaction-button"
                onClick={() => setIsModalOpen(true)}
            >
                Add Transaction
            </button>
            <TransactionSummary transactions={filteredTransactions} />
            {filteredTransactions.length > 0 ? (
                <TransactionTable
                    transactions={filteredTransactions}
                    onDelete={handleDeleteTransaction}
                />
            ) : (
                <p className="no-transactions">No transactions match your criteria.</p>
            )}
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
