import React, { useEffect, useState } from "react";

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch("http://localhost:5001/api/transactions", {
                    headers: {
                        Authorization: `Bearer ${process.env.JWT_SECRET}`,
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Dashboard</h1>
            <div style={{ margin: "0 auto", width: "90%", maxWidth: "800px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
                    <thead>
                        <tr>
                            <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Date</th>
                            <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Category</th>
                            <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Amount</th>
                            <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction) => (
                            <tr key={transaction._id}>
                                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                                    {new Date(transaction.date).toLocaleDateString()}
                                </td>
                                <td style={{ border: "1px solid #ddd", padding: "10px" }}>{transaction.category}</td>
                                <td style={{ border: "1px solid #ddd", padding: "10px" }}>${transaction.amount}</td>
                                <td style={{ border: "1px solid #ddd", padding: "10px" }}>{transaction.type}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
