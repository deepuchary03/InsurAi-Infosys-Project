import React, { useState, useEffect } from "react";
import { agentAPI, appointmentAPI } from "../services/api";
import AiAssistant from "../components/AiAssistant";
import { processAppointments } from "../utils/appointmentUtils";

function AgentDashboard({ user, onLogout }) {
  const [appointments, setAppointments] = useState([]);

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
        const appointmentsRes = await appointmentAPI.getAppointmentsByAgent(
          myProfile.id
        );

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
            Logged in as: {user.username}
          </span>
          <button className="btn btn-danger" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content glass-container">
        <div className="section">
          <h2>My Appointments</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>
                      {appointment.customerName ||
                        `Customer ${appointment.customerId}`}
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
                    <td>{appointment.notes || "No notes"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Assistant for agents */}
        <AiAssistant user={user} />
      </div>
    </div>
  );
}

export default AgentDashboard;
