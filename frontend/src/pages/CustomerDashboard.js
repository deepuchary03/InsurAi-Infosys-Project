import React, { useState, useEffect } from "react";
import { agentAPI, appointmentAPI, planAPI, formatINR } from "../services/api";
import AiAssistant from "../components/AiAssistant";
import { processAppointments } from "../utils/appointmentUtils";

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
        agentAPI.getAvailableAgents(user.id),
        appointmentAPI.getAppointmentsByCustomer(user.id),
        planAPI.getAllPlans(),
      ]);
      setAgents(agentsRes.data || []);

      // Process appointments to update status based on time
      const processedAppointments = processAppointments(appointmentsRes.data);
      setAppointments(processedAppointments);

      // Update any appointments that changed status
      const updatePromises = processedAppointments
        .filter((appointment) => {
          const originalStatus = appointmentsRes.data.find(
            (a) => a.id === appointment.id
          )?.status;
          return (
            appointment.status !== originalStatus &&
            originalStatus !== "cancelled"
          );
        })
        .map((appointment) =>
          appointmentAPI.updateAppointment(appointment.id, {
            status: appointment.status,
            lastUpdated: new Date().toISOString(),
          })
        );

      // Wait for all updates to complete
      await Promise.all(updatePromises);
      setPlans(plansRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleBookAppointment = async () => {
    try {
      const selectedAgentData = agents.find(
        (agent) => agent.id === selectedAgent
      );
      const [date, time] = appointmentDate.split("T");

      await appointmentAPI.createAppointment({
        customerId: user.id,
        agentId: selectedAgent,
        appointmentDate: date,
        appointmentTime: time,
        reason:
          document.getElementById("appointmentReason")?.value ||
          "General consultation",
        customerName: user.fullName || user.username,
        agentName: selectedAgentData?.name,
      });
      setShowBookingModal(false);
      setSelectedAgent(null);
      setAppointmentDate("");
      fetchData();
      alert(
        "Appointment booked successfully! You will receive a confirmation email."
      );
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment. Please try again.");
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
            Logged in as: {user.username}
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
                  <th>Agent Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>
                      {appointment.agentName || `Agent ${appointment.agentId}`}
                    </td>
                    <td>{appointment.appointmentDate}</td>
                    <td>{appointment.appointmentTime || "Not specified"}</td>
                    <td>{appointment.reason || "General consultation"}</td>
                    <td>
                      <span
                        className={`status-badge ${appointment.status?.toLowerCase()}`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                    <td>
                      {appointment.status !== "Cancelled" &&
                        appointment.status !== "completed" && (
                          <button
                            className="btn btn-danger"
                            onClick={() =>
                              handleCancelAppointment(appointment.id)
                            }
                          >
                            Cancel
                          </button>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Assistant is rendered as a floating widget; not inline in the flow */}
        <AiAssistant user={user} />

        <div className="section">
          <h2>Insurance Plans</h2>
          <div className="grid">
            {plans.map((plan) => (
              <div key={plan.id} className="card">
                <h3>{plan.planName}</h3>
                <p>{plan.description}</p>
                <p>
                  <strong>Price:</strong> {formatINR(plan.price)}
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
            {selectedAgent && (
              <div className="selected-agent-info">
                <h4>
                  Selected Agent:{" "}
                  {agents.find((a) => a.id === selectedAgent)?.name}
                </h4>
                <p>
                  <strong>Specialization:</strong>{" "}
                  {agents.find((a) => a.id === selectedAgent)?.specialization}
                </p>
                <p>
                  <strong>Working Hours:</strong>{" "}
                  {agents.find((a) => a.id === selectedAgent)?.workingHours ||
                    "Contact for schedule"}
                </p>
              </div>
            )}
            <div className="form-group">
              <label>Appointment Date & Time</label>
              <input
                type="datetime-local"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Reason for Appointment</label>
              <select
                id="appointmentReason"
                defaultValue="General consultation"
              >
                <option value="General consultation">
                  General Consultation
                </option>
                <option value="Policy inquiry">Policy Inquiry</option>
                <option value="Claims assistance">Claims Assistance</option>
                <option value="Policy renewal">Policy Renewal</option>
                <option value="New policy">New Policy Discussion</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="action-buttons">
              <button
                className="btn"
                onClick={handleBookAppointment}
                disabled={!appointmentDate}
              >
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
