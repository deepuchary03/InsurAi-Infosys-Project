import React, { useState, useEffect } from "react";
import { userAPI, agentAPI, appointmentAPI, planAPI } from "../services/api";

function AdminDashboard({ user, onLogout }) {
  const [users, setUsers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [plans, setPlans] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, agentsRes, appointmentsRes, plansRes] =
        await Promise.all([
          userAPI.getAllUsers(),
          agentAPI.getAllAgents(),
          appointmentAPI.getAllAppointments(),
          planAPI.getAllPlans(),
        ]);
      setUsers(usersRes.data);
      setAgents(agentsRes.data);
      setAppointments(appointmentsRes.data);
      setPlans(plansRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddAgent = async () => {
    try {
      await agentAPI.createAgent(formData);
      setShowModal(false);
      setFormData({});
      fetchData();
    } catch (error) {
      console.error("Error adding agent:", error);
    }
  };

  const handleAddPlan = async () => {
    try {
      await planAPI.createPlan(formData);
      setShowModal(false);
      setFormData({});
      fetchData();
    } catch (error) {
      console.error("Error adding plan:", error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await userAPI.deleteUser(id);
      fetchData();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleDeleteAgent = async (id) => {
    try {
      await agentAPI.deleteAgent(id);
      fetchData();
    } catch (error) {
      console.error("Error deleting agent:", error);
    }
  };

  const handleDeletePlan = async (id) => {
    try {
      await planAPI.deletePlan(id);
      fetchData();
    } catch (error) {
      console.error("Error deleting plan:", error);
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setFormData({});
    setShowModal(true);
  };

  return (
    <div className="dashboard dashboard-container">
      <div className="dashboard-header glass-header">
        <h1>Admin Dashboard</h1>
        <div>
          <span style={{ marginRight: "20px", color: "#666" }}>
            Welcome, {user.username}!
          </span>
          <button className="btn btn-danger" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content glass-container">
        <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
          <button
            className={`btn ${activeTab === "users" ? "" : "btn-secondary"}`}
            onClick={() => setActiveTab("users")}
          >
            Users ({users.length})
          </button>
          <button
            className={`btn ${activeTab === "agents" ? "" : "btn-secondary"}`}
            onClick={() => setActiveTab("agents")}
          >
            Agents ({agents.length})
          </button>
          <button
            className={`btn ${
              activeTab === "appointments" ? "" : "btn-secondary"
            }`}
            onClick={() => setActiveTab("appointments")}
          >
            Appointments ({appointments.length})
          </button>
          <button
            className={`btn ${activeTab === "plans" ? "" : "btn-secondary"}`}
            onClick={() => setActiveTab("plans")}
          >
            Plans ({plans.length})
          </button>
        </div>

        {activeTab === "users" && (
          <div className="section">
            <h2>Users Management</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.username}</td>
                      <td>{u.role}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteUser(u.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "agents" && (
          <div className="section">
            <h2>Agents Management</h2>
            <button
              className="btn"
              style={{ marginBottom: "20px" }}
              onClick={() => openModal("agent")}
            >
              Add New Agent
            </button>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Specialization</th>
                    <th>Availability</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {agents.map((agent) => (
                    <tr key={agent.id}>
                      <td>{agent.id}</td>
                      <td>{agent.name}</td>
                      <td>{agent.specialization}</td>
                      <td>{agent.availability}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteAgent(agent.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "appointments" && (
          <div className="section">
            <h2>Appointments Management</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer ID</th>
                    <th>Agent ID</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>{appointment.id}</td>
                      <td>{appointment.customerId}</td>
                      <td>{appointment.agentId}</td>
                      <td>{appointment.appointmentDate}</td>
                      <td>{appointment.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "plans" && (
          <div className="section">
            <h2>Insurance Plans Management</h2>
            <button
              className="btn"
              style={{ marginBottom: "20px" }}
              onClick={() => openModal("plan")}
            >
              Add New Plan
            </button>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Plan Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan) => (
                    <tr key={plan.id}>
                      <td>{plan.id}</td>
                      <td>{plan.planName}</td>
                      <td>{plan.description}</td>
                      <td>${plan.price}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeletePlan(plan.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{modalType === "agent" ? "Add New Agent" : "Add New Plan"}</h3>
            {modalType === "agent" ? (
              <>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Specialization</label>
                  <input
                    type="text"
                    value={formData.specialization || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specialization: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Availability</label>
                  <input
                    type="text"
                    value={formData.availability || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, availability: e.target.value })
                    }
                  />
                </div>
                <div className="action-buttons">
                  <button className="btn" onClick={handleAddAgent}>
                    Add Agent
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label>Plan Name</label>
                  <input
                    type="text"
                    value={formData.planName || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, planName: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    value={formData.price || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="action-buttons">
                  <button className="btn" onClick={handleAddPlan}>
                    Add Plan
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
