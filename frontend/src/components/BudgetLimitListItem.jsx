import React from "react";
import axios from "axios";
import "../styles/style.css";

function BudgetLimitListItem({limit, onDeleteSuccess}){ //to display all the limits as a list of items
    const handleDelete = async () => {
        if(window.confirm("Are you sure you want to delete this Limit?")){
            try{
                await axios.delete(`http://localhost:5000/budget-limit/${limit.id}`, {withCredentials: true});
                alert("Limit deleted!");
                onDeleteSuccess();
            }catch(err){
                alert("Failed to delete limit.");

            }
        }
    };

    return (
        <li className="budegt-limit-item">
            <div className="budget-limit-info">
                <span className="budget-category">{limit.category}</span>
                <span className="budget-amount">{limit.limit}</span>
            </div>
            <div className="budget-actions">
                <button onClick={handleDelete} className="delete-button">Delete</button>
            </div>
        </li>
    );
}

export default BudgetLimitListItem;