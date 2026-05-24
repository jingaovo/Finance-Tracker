import React from "react";

const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format(value);

const TransactionSummary = ({ transactions }) => {
    const totalIncome = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    const cards = [
        {
            label: "Total income",
            value: totalIncome,
            accent: "emerald",
            icon: (
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12" />
            ),
        },
        {
            label: "Total expenses",
            value: totalExpenses,
            accent: "rose",
            icon: (
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            ),
        },
        {
            label: "Net balance",
            value: balance,
            accent: balance >= 0 ? "indigo" : "amber",
            icon: (
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            ),
        },
    ];

    const accentStyles = {
        emerald: {
            card: "border-emerald-100",
            icon: "bg-emerald-50 text-emerald-600",
            value: "text-emerald-700",
        },
        rose: {
            card: "border-rose-100",
            icon: "bg-rose-50 text-rose-600",
            value: "text-rose-700",
        },
        indigo: {
            card: "border-indigo-100",
            icon: "bg-indigo-50 text-indigo-600",
            value: "text-indigo-700",
        },
        amber: {
            card: "border-amber-100",
            icon: "bg-amber-50 text-amber-600",
            value: "text-amber-700",
        },
    };

    return (
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
            {cards.map(({ label, value, accent, icon }) => {
                const styles = accentStyles[accent];
                return (
                    <div
                        key={label}
                        className={`rounded-xl border bg-white p-5 shadow-sm ${styles.card}`}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">{label}</p>
                                <p className={`mt-2 text-2xl font-bold tracking-tight ${styles.value}`}>
                                    {formatCurrency(value)}
                                </p>
                            </div>
                            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${styles.icon}`}>
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    {icon}
                                </svg>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TransactionSummary;
