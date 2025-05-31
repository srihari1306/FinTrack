import React, { useState } from "react";
import axios from "axios";
import "../styles/style.css";

function AddTransactionModal({ onClose, onSuccess }){
    const [form, setForm] = useState({
        type:"income",
        amount:"",
        category:"",
        date:"",
        description:""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async () => {
        // validations
        if(!["income","expense"].includes(form.type)){
            return alert("Type must be income or expense");
        }
        const amount = parseFloat(form.amount); //converting string to float
        if(isNaN(amount) || amount<=0 ){
            return alert("Amount must be a positive number")
        }
        if(!form.date.match(/^\d{4}-\d{2}-\d{2}$/)){
            return alert("Date must be in YYYY-MM-DD format")
        }

        //code to add transaction
        try{
            await axios.post("http://localhost:5000/transactions",form,{withCredentials: true});
            alert("Transaction added")
            onSuccess();
            onClose();//for cancel button
        }catch(err){
            alert("Failed to add transaction");
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h3>Add Transaction</h3>
                
                <div className="form-group">
                    <select 
                        name="type" 
                        value={form.type} 
                        onChange={handleChange}
                        className={form.type === 'income' ? 'income-select' : 'expense-select'}
                    >
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>
                
                <input 
                    name="amount" 
                    value={form.amount} 
                    onChange={handleChange} 
                    placeholder="Amount" 
                    type="number"
                    min="0"
                    step="0.01"
                />
                
                <input 
                    name="category" 
                    value={form.category} 
                    onChange={handleChange} 
                    placeholder="Category (e.g., Salary, Food, Rent)" 
                />
                
                <input 
                    name="date" 
                    value={form.date} 
                    onChange={handleChange} 
                    placeholder="YYYY-MM-DD" 
                    type="date"
                />
                <input
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Description"
                />

                <div className="modal-actions">
                    <button onClick={handleSubmit}>Add Transaction</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default AddTransactionModal;