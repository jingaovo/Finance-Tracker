import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import TransactionSummary from "../components/TransactionSummary";
import TransactionTable from "../components/TransactionTable";
import TransactionModal from "../components/TransactionModal";

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTransaction, setCurrentTransaction] = useState(null);

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

    const handleAddTransaction = (newTransaction) => {
        setTransactions((prev) => [...prev, newTransaction]);
    };

    const handleEditTransaction = (updatedTransaction) => {
        setTransactions((prev) =>
            prev.map((transaction) =>
                transaction._id === updatedTransaction._id
                    ? updatedTransaction
                    : transaction
            )
        );
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

    const openEditModal = (transaction) => {
        setCurrentTransaction(transaction);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentTransaction(null);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="dashboard">
            <h1 className="dashboard-title">Dashboard</h1>
            <button
                className="add-transaction-button"
                onClick={() => setIsModalOpen(true)}
            >
                Add Transaction
            </button>
            <TransactionSummary transactions={transactions} />
            {transactions.length > 0 ? (
                <TransactionTable
                    transactions={transactions}
                    onEdit={openEditModal}
                    onDelete={handleDeleteTransaction}
                />
            ) : (
                <p className="no-transactions">No transactions yet. Add your first transaction!</p>
            )}
            {isModalOpen && (
                <TransactionModal
                    onClose={closeModal}
                    onAddTransaction={currentTransaction ? handleEditTransaction : handleAddTransaction}
                    transaction={currentTransaction}
                />
            )}
        </div>
    );
};

export default Dashboard;
