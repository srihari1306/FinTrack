import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/style.css";

function Navbar(){
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.get("http://localhost:5000/logout", { withCredentials: true });
            alert("Logged out successfully");
            navigate("/login");
        } catch {
            alert("Logout failed");
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-title">💰 FinTrack</div>
            <Link to="/analytics">Analytics</Link>
            <Link to="/budget-limits">Manage Budget Limits</Link>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
        </nav>
    )
}
export default Navbar;