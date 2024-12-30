import React, { useState } from "react";
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
} from "chart.js";
import "./DataVisualization.css"; // Import CSS

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const DataVisualization = ({ transactions }) => {
    const [activeChart, setActiveChart] = useState(0); // Track the current chart

    const income = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    const categories = [...new Set(transactions.map((t) => t.category))];
    const categoryTotals = categories.map((category) => {
        return transactions
            .filter((t) => t.category === category)
            .reduce((sum, t) => sum + t.amount, 0);
    });

    const monthlyData = transactions.reduce((acc, t) => {
        const month = new Date(t.date).toLocaleString("default", { month: "short" });
        acc[month] = acc[month] || { income: 0, expense: 0 };
        acc[month][t.type] += t.amount;
        return acc;
    }, {});

    const months = Object.keys(monthlyData);
    const monthlyIncome = months.map((month) => monthlyData[month].income);
    const monthlyExpenses = months.map((month) => monthlyData[month].expense);

    const charts = [
        {
            title: "Income vs. Expenses",
            chart: (
                <Pie
                    data={{
                        labels: ["Income", "Expenses"],
                        datasets: [
                            {
                                label: "Income vs. Expenses",
                                data: [income, expenses],
                                backgroundColor: ["#4caf50", "#f44336"],
                            },
                        ],
                    }}
                />
            ),
        },
        {
            title: "Spending by Category",
            chart: (
                <Bar
                    data={{
                        labels: categories,
                        datasets: [
                            {
                                label: "Amount",
                                data: categoryTotals,
                                backgroundColor: "#b5a68c",
                            },
                        ],
                    }}
                    options={{
                        plugins: {
                            legend: { display: false },
                        },
                    }}
                />
            ),
        },
        {
            title: "Monthly Income & Expenses",
            chart: (
                <Line
                    data={{
                        labels: months,
                        datasets: [
                            {
                                label: "Income",
                                data: monthlyIncome,
                                borderColor: "#4caf50",
                                backgroundColor: "rgba(76, 175, 80, 0.2)",
                                fill: true,
                            },
                            {
                                label: "Expenses",
                                data: monthlyExpenses,
                                borderColor: "#f44336",
                                backgroundColor: "rgba(244, 67, 54, 0.2)",
                                fill: true,
                            },
                        ],
                    }}
                />
            ),
        },
    ];

    const handleNext = () => {
        setActiveChart((prev) => (prev + 1) % charts.length);
    };

    const handlePrevious = () => {
        setActiveChart((prev) => (prev - 1 + charts.length) % charts.length);
    };

    return (
        <div className="data-visualization">
            <div className="chart-container">
                <h3>{charts[activeChart].title}</h3>
                {charts[activeChart].chart}
            </div>
            <div className="chart-navigation">
                <button onClick={handlePrevious} className="nav-button">
                    Previous
                </button>
                <button onClick={handleNext} className="nav-button">
                    Next
                </button>
            </div>
        </div>
    );
};

export default DataVisualization;
