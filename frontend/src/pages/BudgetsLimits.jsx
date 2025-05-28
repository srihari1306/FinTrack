import React, { useEffect, useState } from "react";
import BudgetLimitListItem from "../components/BudgetLimitListItem";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/style.css";

function BudgetLimits(){
    const[limits,setLimits] = useState([])
    const [form,setForm] = useState({
        category: "",
        limit: ""
    })

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    }


    const fetchLimits = async () => {
        try{
            const res = await axios.get("http://localhost:5000/budget-limit",{withCredentials: true});
            setLimits(res.data)
        } catch(err){
            alert("Failed to load limits")
        }
    }

    const handleSubmit = async () => {
        try{
            await axios.post("http://localhost:5000/budget-limit", form, {withCredentials: true});
            setForm({category: "", limit: ""});
            fetchLimits();
        } catch(error){
            alert("Failed to set limits")
        }
    }

    useEffect(() => {
        fetchLimits();
    },[]);

    return (
        <div className="budget-limits-container">
            <div className="budget-limits-header">
                <h2>Set Budget Limits</h2>
                <Link to="/dashboard" className="back-link">back to dashboard</Link>
            </div>
            <div className="budget-form">
                <input
                    className="budget-input"
                    name="category"
                    placeholder="Category"
                    value={form.category}
                    onChange={handleChange}
                />
                <input
                    className="budget-input"
                    name="limit"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Limit"
                    value={form.limit}
                    onChange={handleChange}
                />
                <button className="set-limit-button" onClick={handleSubmit}>Set/Update limit</button>
            </div>
            <div className="budget-limits-list">
                <div className="budget-limits-title">
                    <h3>Your limits</h3>
                </div>
                <ul className="budget-limits">
                    {limits.length===0 ? (
                        <li className="empty-state">No limits yet</li>
                    ):(
                        limits.map((l) => (
                            <BudgetLimitListItem 
                                key={l.id} 
                                limit={l} 
                                onDeleteSuccess={fetchLimits}
                            />
                        ))
                    )}
                </ul>
            </div>
        </div>
    )
}
export default BudgetLimits;