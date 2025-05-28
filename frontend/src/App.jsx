import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BudgetLimits from "./pages/BudgetsLimits";
import Analytics from "./pages/Analytics";
import PrivateRoute from "./components/PrivateRoute";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard" 
          element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route
          path="/budget-limits"
          element={<PrivateRoute><BudgetLimits /></PrivateRoute>} />
        <Route 
          path="/analytics"
          element={<PrivateRoute><Analytics /></PrivateRoute>} />
      </Routes>
    </Router>
  )
}

export default App
