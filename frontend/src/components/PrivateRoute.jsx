import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

function PrivateRoute({ children }) { // this is used to protect private routes 
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      await axios.get("http://localhost:5000/dashboard", { withCredentials: true });
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
      }
  };

  useEffect(() => {
    checkAuth(); // Call the async function
  }, []);

  if (loading) return <p>Loading...</p>;

  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
