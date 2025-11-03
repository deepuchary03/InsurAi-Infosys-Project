import React, { useState, useEffect } from "react";
import {
  userAPI,
  agentAPI,
  appointmentAPI,
  planAPI,
  notificationAPI,
  formatINR,
} from "../services/api";
import AppointmentCalendar from "../components/AppointmentCalendar";
import DashboardAnalytics from "../components/DashboardAnalytics";
import { processAppointments } from "../utils/appointmentUtils";

function AdminDashboard({ user, onLogout }) {
  const [users, setUsers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [plans, setPlans] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, agentsRes, appointmentsRes, plansRes, notificationsRes] =
        await Promise.all([
          userAPI.getAllUsers(),
          agentAPI.getAllAgents(),
          appointmentAPI.getAllAppointments(),
          planAPI.getAllPlans(),
          notificationAPI.getAllNotifications(),
        ]);
      setUsers(usersRes.data);
      setAgents(agentsRes.data);
      
      // Process appointments to update status based on time
      const processedAppointments = processAppointments(appointmentsRes.data);
      setAppointments(processedAppointments);
      
      // Update any appointments that changed status
      const updatePromises = processedAppointments
        .filter(appointment => {
          const originalStatus = appointmentsRes.data.find(a => a.id === appointment.id)?.status;
          return appointment.status !== originalStatus && originalStatus !== 'cancelled';
        })
        .map(appointment => 
          appointmentAPI.updateAppointment(appointment.id, { 
            status: appointment.status,
            lastUpdated: new Date().toISOString()
          })
        );
      
      // Wait for all updates to complete
      await Promise.all(updatePromises);
      
      setPlans(plansRes.data);
      setNotifications(notificationsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddAgent = async () => {
    try {
      if (editingItem) {
        await agentAPI.updateAgent(editingItem.id, formData);
      } else {
        await agentAPI.createAgent(formData);
      }
      setShowModal(false);
      setFormData({});
      setEditingItem(null);
      fetchData();
    } catch (error) {
      console.error("Error saving agent:", error);
    }
  };

  const handleAddPlan = async () => {
    try {
      if (editingItem) {
        await planAPI.updatePlan(editingItem.id, formData);
      } else {
        await planAPI.createPlan(formData);
      }
      setShowModal(false);
      setFormData({});
      setEditingItem(null);
      fetchData();
    } catch (error) {
      console.error("Error saving plan:", error);
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

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    if (item) {
      setFormData({ ...item });
    } else {
      setFormData({});
    }
    setShowModal(true);
  };

  return (
    <div className="dashboard dashboard-container">
      <div className="dashboard-header glass-header">
        <h1>Admin Dashboard</h1>
        <div>
          <span style={{ marginRight: "20px", color: "#666" }}>
            Logged in as: {user.username}
          </span>
          <button className="btn btn-danger" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content glass-container">
        <div className="dashboard-tabs">
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
          <button
            className={`btn ${
              activeTab === "notifications" ? "" : "btn-secondary"
            }`}
            onClick={() => setActiveTab("notifications")}
          >
            Notifications ({notifications.length})
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
                        <div className="table-actions">
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDeleteUser(u.id)}
                          >
                            Delete
                          </button>
                        </div>
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
                        <div className="table-actions">
                          <button
                            className="btn btn-secondary"
                            onClick={() => openModal("agent", agent)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDeleteAgent(agent.id)}
                          >
                            Delete
                          </button>
                        </div>
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
            <div className="appointment-analytics">
              <DashboardAnalytics appointments={appointments} />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <AppointmentCalendar
                appointments={appointments}
                agents={agents}
                users={users}
              />
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer Name</th>
                    <th>Agent Name</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => {
                    const customer = users.find(
                      (u) => u.id === appointment.customerId
                    );
                    const agent = agents.find(
                      (a) => a.id === appointment.agentId
                    );
                    return (
                      <tr key={appointment.id}>
                        <td>{appointment.id}</td>
                        <td>
                          {customer ? customer.username : "Unknown Customer"}
                        </td>
                        <td>{agent ? agent.name : "Unknown Agent"}</td>
                        <td>{appointment.appointmentDate}</td>
                        <td>{appointment.status}</td>
                      </tr>
                    );
                  })}
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
                    <th>Price (₹)</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan) => (
                    <tr key={plan.id}>
                      <td>{plan.id}</td>
                      <td>{plan.planName}</td>
                      <td>{plan.description}</td>
                      <td>{formatINR(plan.price)}</td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="btn btn-secondary"
                            onClick={() => openModal("plan", plan)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDeletePlan(plan.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="section">
            <h2>Notifications Management</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Recipient Email</th>
                    <th>Type</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Created At</th>
                    <th>Sent At</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((notification) => (
                    <tr key={notification.id}>
                      <td>{notification.id}</td>
                      <td>{notification.recipientEmail}</td>
                      <td>{notification.notificationType}</td>
                      <td>{notification.subject}</td>
                      <td>
                        <span
                          className={`status-badge ${notification.status?.toLowerCase()}`}
                        >
                          {notification.status}
                        </span>
                      </td>
                      <td>
                        {notification.createdAt
                          ? new Date(notification.createdAt).toLocaleString()
                          : "N/A"}
                      </td>
                      <td>
                        {notification.sentAt
                          ? new Date(notification.sentAt).toLocaleString()
                          : "Not sent"}
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
            <h3>
              {editingItem
                ? `Edit ${modalType === "agent" ? "Agent" : "Plan"}`
                : `Add New ${modalType === "agent" ? "Agent" : "Plan"}`}
            </h3>
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
                  <select
                    value={formData.availability || "yes"}
                    onChange={(e) =>
                      setFormData({ ...formData, availability: e.target.value })
                    }
                  >
                    <option value="yes">Available</option>
                    <option value="no">Not Available</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    value={formData.phone || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Working Hours</label>
                  <input
                    type="text"
                    placeholder="e.g., 9:00 AM - 5:00 PM"
                    value={formData.workingHours || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, workingHours: e.target.value })
                    }
                  />
                </div>
                <div className="action-buttons">
                  <button className="btn" onClick={handleAddAgent}>
                    {editingItem ? "Update Agent" : "Add Agent"}
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
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    placeholder="Enter price in Indian Rupees"
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
                    {editingItem ? "Update Plan" : "Add Plan"}
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
