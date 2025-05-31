import React from "react";
import axios from "axios";
import "../styles/style.css";

function TransactionListItem({transaction, onEdit, onDeleteSuccess}){ //for the transaction list items
    const handleDelete = async () => {
        if(window.confirm("Are you sure you want to delete this transaction?")){
            try{
                await axios.delete(`http://localhost:5000/transactions/${transaction.id}`, {withCredentials: true});
                alert("Transaction deleted!");
                onDeleteSuccess();
            }catch(err){
                alert("Failed to delete transaction");
            }
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const amountClass = transaction.type === 'income' ? 'income' : 'expense';

    return (
        <li className={`transaction-item ${transaction.type}`}>
            <div className="transaction-info">
                <div className="transaction-main">
                    <span className="transaction-date">{formatDate(transaction.date)}</span>
                    <span className={`transaction-amount ${amountClass}`}>
                        {transaction.type === 'income' ? '+' : '-'} ₹{transaction.amount}
                    </span>
                </div>
                <span className="transaction-category">{transaction.category}</span>
                <span className ="transaction-description">{transaction.description}</span>
            </div>
            <div className="transaction-actions">
                <button onClick={() => onEdit(transaction)}>Edit</button>
                <button onClick={handleDelete}>Delete</button>
            </div>
        </li>
    );
}

export default TransactionListItem;