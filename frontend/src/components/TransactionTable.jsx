import React from "react";

const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format(value);

const TransactionTable = ({ transactions }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                    <tr className="border-b border-slate-100">
                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Date
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Category
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Description
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Type
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Amount
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {transactions.map((transaction) => {
                        const isIncome = transaction.type === "income";
                        return (
                            <tr
                                key={transaction._id}
                                className="transition-colors hover:bg-slate-50/80"
                            >
                                <td className="whitespace-nowrap px-4 py-3.5 text-slate-600">
                                    {new Date(transaction.date).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </td>
                                <td className="px-4 py-3.5">
                                    <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                                        {transaction.category}
                                    </span>
                                </td>
                                <td className="max-w-[200px] truncate px-4 py-3.5 font-medium text-slate-800 sm:max-w-xs">
                                    {transaction.description}
                                </td>
                                <td className="px-4 py-3.5">
                                    <span
                                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                                            isIncome
                                                ? "bg-emerald-50 text-emerald-700"
                                                : "bg-rose-50 text-rose-700"
                                        }`}
                                    >
                                        {transaction.type}
                                    </span>
                                </td>
                                <td
                                    className={`whitespace-nowrap px-4 py-3.5 text-right font-semibold tabular-nums ${
                                        isIncome ? "text-emerald-600" : "text-rose-600"
                                    }`}
                                >
                                    {isIncome ? "+" : "-"}
                                    {formatCurrency(transaction.amount)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionTable;
