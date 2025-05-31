import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddTransactionModal from "../components/AddTransactionModal";
import EditTransactionModal from "../components/EditTransactionModal";
import TransactionListItem from "../components/TransactionListItem";
import Navbar from "../components/Navbar";
import "../styles/style.css";

function Dashboard(){// dashboard for transactions
    const [username, setUsername] = useState("");
    const [summary, setSummary] = useState({ income:0, expense:0, balance:0});
    const [transactions, setTransactions] = useState([]);
    const [warnings, setWarnings] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editTransaction, setEditTransaction] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const fetchDashBoard = async () => {
        setIsLoading(true);
        try{
            const res = await axios.get("http://localhost:5000/dashboard",{withCredentials: true});
            setUsername(res.data.username);
            setSummary(res.data.summary);
            setTransactions(res.data.transactions);
            setWarnings(res.data.warnings)
            setIsLoading(false);
        } catch(error) {
            alert("Login expired");
            navigate("/");
        }
    };

    useEffect(() => {
        fetchDashBoard();
    },[navigate]);

    const handleEditClick = (t) => {
        setEditTransaction(t);
    };

    if (isLoading) {
        return <div className="loading">Loading dashboard</div>;
    }

    return (
        <>
            <Navbar />
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h2>Welcome, {username}</h2>
                </div>

                <div className="summary-section">
                    <div className="summary-box income">Income: ₹{summary.income.toLocaleString()} </div>
                    <div className="summary-box expense">Expense: ₹{summary.expense.toLocaleString()} </div>
                    <div className="summary-box balance">Balance: ₹{summary.balance.toLocaleString()} </div>
                </div>

                {warnings.length > 0 && (
                    <div>
                        <h4>Budget Warnings: </h4>
                        <ul>
                            {warnings.map((category,i) => (
                                <li key={i}>{category}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="transactions-section">
                    <div className="transactions-header">
                        <h3>Recent Transactions</h3>
                        <button onClick={() => setShowAddModal(true)}>+ Add Transaction</button>
                    </div>
                    <ul>
                        {transactions.length===0 ? (
                            <li className="empty-state">No transactions yet</li>
                        ):(
                            transactions.map((t) => (
                                <TransactionListItem 
                                    key={t.id} 
                                    transaction={t} 
                                    onEdit={handleEditClick} 
                                    onDeleteSuccess={fetchDashBoard}
                                />
                            ))
                        )}
                    </ul>
                </div>
                {showAddModal && (
                    <AddTransactionModal 
                        onClose={() => setShowAddModal(false)} 
                        onSuccess={fetchDashBoard} 
                    />
                )}

                {editTransaction && (
                    <EditTransactionModal 
                        transaction={editTransaction} 
                        onClose={() => setEditTransaction(null)} 
                        onSuccess={fetchDashBoard} 
                    />
                )}
            </div>
        </>
    );
}

export default Dashboard;