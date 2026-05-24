import React from "react";
import { Pie, Bar, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const CHART_HEIGHT = 200;

const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: "bottom",
            labels: {
                boxWidth: 10,
                padding: 12,
                font: { size: 11, family: "'Noto Sans JP', sans-serif" },
                color: "#64748b",
            },
        },
        tooltip: {
            backgroundColor: "#1e293b",
            titleFont: { size: 12 },
            bodyFont: { size: 12 },
            padding: 10,
            cornerRadius: 8,
        },
    },
};

const categoryColors = [
    "#10b981",
    "#6366f1",
    "#f59e0b",
    "#ec4899",
    "#14b8a6",
    "#8b5cf6",
    "#f97316",
    "#06b6d4",
];

const ChartCard = ({ title, subtitle, children, empty }) => (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-3">
            <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
            {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
        </div>
        {empty ? (
            <div
                className="flex flex-col items-center justify-center rounded-lg bg-slate-50 text-center"
                style={{ height: CHART_HEIGHT }}
            >
                <p className="text-sm font-medium text-slate-500">No data yet</p>
                <p className="mt-0.5 text-xs text-slate-400">Add transactions to see this chart</p>
            </div>
        ) : (
            <div style={{ height: CHART_HEIGHT }}>{children}</div>
        )}
    </div>
);

const DataVisualization = ({ transactions }) => {
    const income = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    const expenseTransactions = transactions.filter((t) => t.type === "expense");
    const categories = [...new Set(expenseTransactions.map((t) => t.category))];
    const categoryTotals = categories.map((category) =>
        expenseTransactions
            .filter((t) => t.category === category)
            .reduce((sum, t) => sum + t.amount, 0)
    );

    const monthlyData = transactions.reduce((acc, t) => {
        const month = new Date(t.date).toLocaleString("default", { month: "short", year: "2-digit" });
        acc[month] = acc[month] || { income: 0, expense: 0 };
        acc[month][t.type] += t.amount;
        return acc;
    }, {});

    const months = Object.keys(monthlyData);
    const monthlyIncome = months.map((month) => monthlyData[month].income);
    const monthlyExpenses = months.map((month) => monthlyData[month].expense);

    const hasOverviewData = income > 0 || expenses > 0;
    const hasCategoryData = categoryTotals.some((v) => v > 0);
    const hasTrendData = months.length > 0;

    return (
        <div>
            <div className="mb-4">
                <h2 className="text-base font-semibold text-slate-900">Analytics</h2>
                <p className="text-sm text-slate-500">Visual breakdown of your financial activity</p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                <ChartCard title="Income vs expenses" subtitle="Overall split" empty={!hasOverviewData}>
                    <Pie
                        data={{
                            labels: ["Income", "Expenses"],
                            datasets: [
                                {
                                    data: [income, expenses],
                                    backgroundColor: ["#10b981", "#f43f5e"],
                                    borderWidth: 0,
                                    hoverOffset: 4,
                                },
                            ],
                        }}
                        options={{
                            ...baseOptions,
                            plugins: {
                                ...baseOptions.plugins,
                                legend: { ...baseOptions.plugins.legend, position: "right" },
                            },
                        }}
                    />
                </ChartCard>

                <ChartCard title="Spending by category" subtitle="Expenses only" empty={!hasCategoryData}>
                    <Bar
                        data={{
                            labels: categories,
                            datasets: [
                                {
                                    label: "Amount",
                                    data: categoryTotals,
                                    backgroundColor: categories.map((_, i) => categoryColors[i % categoryColors.length]),
                                    borderRadius: 6,
                                    borderSkipped: false,
                                },
                            ],
                        }}
                        options={{
                            ...baseOptions,
                            plugins: { ...baseOptions.plugins, legend: { display: false } },
                            scales: {
                                x: {
                                    grid: { display: false },
                                    ticks: { font: { size: 10 }, color: "#94a3b8", maxRotation: 45 },
                                },
                                y: {
                                    grid: { color: "#f1f5f9" },
                                    ticks: { font: { size: 10 }, color: "#94a3b8" },
                                    beginAtZero: true,
                                },
                            },
                        }}
                    />
                </ChartCard>

                <ChartCard title="Monthly trend" subtitle="Income & expenses over time" empty={!hasTrendData}>
                    <Line
                        data={{
                            labels: months,
                            datasets: [
                                {
                                    label: "Income",
                                    data: monthlyIncome,
                                    borderColor: "#10b981",
                                    backgroundColor: "rgba(16, 185, 129, 0.08)",
                                    fill: true,
                                    tension: 0.35,
                                    pointRadius: 3,
                                    pointHoverRadius: 5,
                                },
                                {
                                    label: "Expenses",
                                    data: monthlyExpenses,
                                    borderColor: "#f43f5e",
                                    backgroundColor: "rgba(244, 63, 94, 0.08)",
                                    fill: true,
                                    tension: 0.35,
                                    pointRadius: 3,
                                    pointHoverRadius: 5,
                                },
                            ],
                        }}
                        options={{
                            ...baseOptions,
                            scales: {
                                x: {
                                    grid: { display: false },
                                    ticks: { font: { size: 10 }, color: "#94a3b8" },
                                },
                                y: {
                                    grid: { color: "#f1f5f9" },
                                    ticks: { font: { size: 10 }, color: "#94a3b8" },
                                    beginAtZero: true,
                                },
                            },
                        }}
                    />
                </ChartCard>
            </div>
        </div>
    );
};

export default DataVisualization;
