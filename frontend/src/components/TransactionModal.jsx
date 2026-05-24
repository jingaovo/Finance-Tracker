import React, { useState, useEffect } from "react";

const inputClass =
    "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500";

const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

const TransactionModal = ({ onClose, onAddTransaction, transaction }) => {
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("income");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const isEditing = Boolean(transaction);

    useEffect(() => {
        if (transaction) {
            setAmount(transaction.amount);
            setCategory(transaction.category);
            setType(transaction.type);
            setDate(transaction.date.split("T")[0]);
            setDescription(transaction.description);
        } else {
            setDate(new Date().toISOString().split("T")[0]);
        }
    }, [transaction]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

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
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    category,
                    date,
                    description,
                    type,
                }),
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
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="transaction-modal-title"
        >
            <button
                type="button"
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                onClick={onClose}
                aria-label="Close modal"
            />

            <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
                    <div>
                        <h2 id="transaction-modal-title" className="text-lg font-semibold text-slate-900">
                            {isEditing ? "Edit transaction" : "Add transaction"}
                        </h2>
                        <p className="mt-0.5 text-sm text-slate-500">
                            {isEditing
                                ? "Update the details below."
                                : "Record a new income or expense."}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                        aria-label="Close"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5">
                    <div className="mb-5">
                        <span className={labelClass}>Type</span>
                        <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
                            <button
                                type="button"
                                onClick={() => setType("income")}
                                className={`rounded-md py-2 text-sm font-semibold transition ${
                                    type === "income"
                                        ? "bg-white text-emerald-700 shadow-sm"
                                        : "text-slate-500 hover:text-slate-700"
                                }`}
                            >
                                Income
                            </button>
                            <button
                                type="button"
                                onClick={() => setType("expense")}
                                className={`rounded-md py-2 text-sm font-semibold transition ${
                                    type === "expense"
                                        ? "bg-white text-rose-700 shadow-sm"
                                        : "text-slate-500 hover:text-slate-700"
                                }`}
                            >
                                Expense
                            </button>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="tx-amount" className={labelClass}>
                                Amount
                            </label>
                            <div className="relative">
                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                                    $
                                </span>
                                <input
                                    id="tx-amount"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className={`${inputClass} pl-7`}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="tx-date" className={labelClass}>
                                Date
                            </label>
                            <input
                                id="tx-date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className={inputClass}
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label htmlFor="tx-category" className={labelClass}>
                            Category
                        </label>
                        <input
                            id="tx-category"
                            type="text"
                            placeholder="e.g. Groceries, Salary"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className={inputClass}
                            required
                        />
                    </div>

                    <div className="mt-4">
                        <label htmlFor="tx-description" className={labelClass}>
                            Description
                        </label>
                        <textarea
                            id="tx-description"
                            placeholder="What was this transaction for?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className={`${inputClass} resize-none`}
                        />
                    </div>

                    {error && (
                        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div className="mt-6 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? isEditing
                                    ? "Saving…"
                                    : "Adding…"
                                : isEditing
                                  ? "Save changes"
                                  : "Add transaction"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionModal;
