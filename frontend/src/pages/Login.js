import React, { useState } from "react";
import { userAPI } from "../services/api";

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "CUSTOMER",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegister) {
        const response = await userAPI.register(formData);
        console.log("API Response:", response.data);
        const { token, id, username, role } = response.data;
        console.log("Generated Token:", token);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify({ id, username, role }));
        onLogin({ id, username, role });
      } else {
        const response = await userAPI.login({
          username: formData.username,
          password: formData.password,
        });
        const { token, id, username, role } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify({ id, username, role }));
        onLogin({ id, username, role });
      }
    } catch (err) {
      setError(
        isRegister
          ? "Registration failed. Please try again."
          : "Invalid username or password."
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{isRegister ? "Register" : "Login"}</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {isRegister && (
            <div className="form-group">
              <label>Role</label>
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="CUSTOMER">Customer</option>
                <option value="AGENT">Agent</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          )}
          <button type="submit" className="btn">
            {isRegister ? "Register" : "Login"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
