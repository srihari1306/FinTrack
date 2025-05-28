//Recharts is a charting library specifically designed for use in React applications
//this page contains the visual representation of income and expenses which are created using recharts
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts"
import "../styles/style.css";


const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF4560"]

/*
the json object got from the backend looks like:
{
  "income": [{ "category": "Salary", "total": 5000 }, ...],
  "expense": [{ "category": "Food", "total": 1200 }, ...]
}
*/
function Analytics(){
    const [income,setIncome] = useState([]);
    const [expense,setExpense] = useState([]);

    const fetchData = async () => {
        try{
            const res = await axios.get("http://localhost:5000/category-summary", {withCredentials: true})
            console.log("Income:", res.data.income);
            console.log("Expense:", res.data.expense);
            setIncome(res.data.income);
            setExpense(res.data.expense);
        } catch(err){
            alert("Failed to load analytics")
        }
    }

    useEffect(() => {
        fetchData();
    },[]);

    const renderPieChart = (data,title) => (
        <div className="chart-box">
            <h3>{title}</h3>
            <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="total" // numeric value (total amount gained/spent in each category)
                        nameKey="category" // the name of the slice(category)
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label
                    >
                        {data.map((_,index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} /> // gives unique color to each cell
                        ))}
                    </Pie>
                    <Tooltip/>
                    <Legend/>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );

    return (
        <div className="analytics-container">
            <div className="analytics-header">
                <h2>Category-wise Analytics</h2>
                <Link to="/dashboard" className="back-link">back to dashboard</Link>
            </div>
            <div className="chart-container">
                {renderPieChart(income,"Income by Category")}
                {renderPieChart(expense,"Expense by Category")}
            </div>
        </div>
    );
}
export default Analytics;