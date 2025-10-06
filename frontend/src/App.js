import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import CustomerDashboard from "./pages/CustomerDashboard";
import AgentDashboard from "./pages/AgentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import GeminiBackground from "./Gemini_Generated.png";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <div className="app-container">
      <div className="fixed-background"></div>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                user.role === "CUSTOMER" ? (
                  <Navigate to="/customer" />
                ) : user.role === "AGENT" ? (
                  <Navigate to="/agent" />
                ) : user.role === "ADMIN" ? (
                  <Navigate to="/admin" />
                ) : (
                  <Navigate to="/login" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/login"
            element={
              user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
            }
          />
          <Route
            path="/customer"
            element={
              user && user.role === "CUSTOMER" ? (
                <CustomerDashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/agent"
            element={
              user && user.role === "AGENT" ? (
                <AgentDashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/admin"
            element={
              user && user.role === "ADMIN" ? (
                <AdminDashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
