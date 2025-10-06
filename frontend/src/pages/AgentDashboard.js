import React, { useState, useEffect } from "react";
import { agentAPI, appointmentAPI } from "../services/api";

function AgentDashboard({ user, onLogout }) {
  const [agentProfile, setAgentProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    availability: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const agentsRes = await agentAPI.getAllAgents();
      const myProfile =
        agentsRes.data.find((a) => a.name === user.username) ||
        agentsRes.data[0];

      if (myProfile) {
        setAgentProfile(myProfile);
        setFormData({
          name: myProfile.name,
          specialization: myProfile.specialization,
          availability: myProfile.availability,
        });

        const appointmentsRes = await appointmentAPI.getAppointmentsByAgent(
          myProfile.id
        );
        setAppointments(appointmentsRes.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await agentAPI.updateAgent(agentProfile.id, formData);
      setShowEditModal(false);
      fetchData();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="dashboard dashboard-container">
      <div className="dashboard-header glass-header">
        <h1>Agent Dashboard</h1>
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
        {agentProfile && (
          <div className="section">
            <h2>My Profile</h2>
            <div className="card">
              <h3>{agentProfile.name}</h3>
              <p>
                <strong>Specialization:</strong> {agentProfile.specialization}
              </p>
              <p>
                <strong>Availability:</strong> {agentProfile.availability}
              </p>
              <button className="btn" onClick={() => setShowEditModal(true)}>
                Edit Profile
              </button>
            </div>
          </div>
        )}

        <div className="section">
          <h2>My Appointments</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>{appointment.customerId}</td>
                    <td>{appointment.appointmentDate}</td>
                    <td>{appointment.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showEditModal && (
        <div className="modal" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Profile</h3>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Specialization</label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) =>
                  setFormData({ ...formData, specialization: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Availability</label>
              <input
                type="text"
                value={formData.availability}
                onChange={(e) =>
                  setFormData({ ...formData, availability: e.target.value })
                }
              />
            </div>
            <div className="action-buttons">
              <button className="btn" onClick={handleUpdateProfile}>
                Save Changes
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AgentDashboard;
