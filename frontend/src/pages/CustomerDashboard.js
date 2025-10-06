import React, { useState, useEffect } from "react";
import { agentAPI, appointmentAPI, planAPI } from "../services/api";

function CustomerDashboard({ user, onLogout }) {
  const [agents, setAgents] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [plans, setPlans] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [agentsRes, appointmentsRes, plansRes] = await Promise.all([
        agentAPI.getAllAgents(),
        appointmentAPI.getAppointmentsByCustomer(user.id),
        planAPI.getAllPlans(),
      ]);
      setAgents(agentsRes.data);
      setAppointments(appointmentsRes.data);
      setPlans(plansRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleBookAppointment = async () => {
    try {
      await appointmentAPI.createAppointment({
        customerId: user.id,
        agentId: selectedAgent,
        appointmentDate: appointmentDate,
      });
      setShowBookingModal(false);
      setSelectedAgent(null);
      setAppointmentDate("");
      fetchData();
    } catch (error) {
      console.error("Error booking appointment:", error);
    }
  };

  const handleCancelAppointment = async (id) => {
    try {
      await appointmentAPI.deleteAppointment(id);
      fetchData();
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    }
  };

  return (
    <div className="dashboard dashboard-container">
      <div className="dashboard-header glass-header">
        <h1>Customer Dashboard</h1>
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
        <div className="section">
          <h2>Available Agents</h2>
          <div className="grid">
            {agents.map((agent) => (
              <div key={agent.id} className="card">
                <h3>{agent.name}</h3>
                <p>
                  <strong>Specialization:</strong> {agent.specialization}
                </p>
                <p>
                  <strong>Availability:</strong> {agent.availability}
                </p>
                <button
                  className="btn"
                  onClick={() => {
                    setSelectedAgent(agent.id);
                    setShowBookingModal(true);
                  }}
                >
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h2>My Appointments</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Agent ID</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>{appointment.agentId}</td>
                    <td>{appointment.appointmentDate}</td>
                    <td>{appointment.status}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleCancelAppointment(appointment.id)}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="section">
          <h2>Insurance Plans</h2>
          <div className="grid">
            {plans.map((plan) => (
              <div key={plan.id} className="card">
                <h3>{plan.planName}</h3>
                <p>{plan.description}</p>
                <p>
                  <strong>Price:</strong> ${plan.price}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showBookingModal && (
        <div className="modal" onClick={() => setShowBookingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Book Appointment</h3>
            <div className="form-group">
              <label>Appointment Date & Time</label>
              <input
                type="datetime-local"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
              />
            </div>
            <div className="action-buttons">
              <button className="btn" onClick={handleBookAppointment}>
                Confirm Booking
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowBookingModal(false)}
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

export default CustomerDashboard;
