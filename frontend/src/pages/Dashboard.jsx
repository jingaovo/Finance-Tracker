import React, { useState, useEffect } from "react";
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
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
                    <p className="text-sm font-medium text-slate-500">Loading your finances…</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto max-w-lg rounded-xl border border-red-200 bg-red-50 p-6 text-center">
                <p className="font-semibold text-red-800">Something went wrong</p>
                <p className="mt-1 text-sm text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-wide text-emerald-600">
                            Overview
                        </p>
                        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Dashboard
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Track income, expenses, and spending patterns at a glance.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Add transaction
                    </button>
                </header>

                <TransactionSummary transactions={transactions} />

                <section className="mb-8">
                    <DataVisualization transactions={filteredTransactions} />
                </section>

                <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div>
                            <h2 className="text-base font-semibold text-slate-900">Recent transactions</h2>
                            <p className="text-sm text-slate-500">
                                {filteredTransactions.length} record{filteredTransactions.length !== 1 ? "s" : ""}
                                {search ? " matching your search" : ""}
                            </p>
                        </div>
                        <div className="relative w-full sm:max-w-xs">
                            <svg
                                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search description or category…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                        </div>
                    </div>

                    <div className="px-2 pb-2 sm:px-4 sm:pb-4">
                        {filteredTransactions.length > 0 ? (
                            <TransactionTable transactions={filteredTransactions} />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                                    <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <p className="font-medium text-slate-700">No transactions found</p>
                                <p className="mt-1 text-sm text-slate-500">
                                    {search ? "Try a different search term." : "Add your first transaction to get started."}
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                {isModalOpen && (
                    <TransactionModal
                        onClose={() => setIsModalOpen(false)}
                        onAddTransaction={handleAddTransaction}
                    />
                )}
            </div>
        </div>
    );
};

export default Dashboard;
