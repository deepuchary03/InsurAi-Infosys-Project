import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import "./AppointmentCalendar.css";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { appointmentAPI } from "../services/api";

function AppointmentCalendar({ appointments, agents, users, onSlotSelect }) {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Transform appointments into events format for FullCalendar
  const events = appointments.map((appointment) => {
    const agent = agents.find((a) => a.id === appointment.agentId);
    const defaultTime = "09:00";
    const appointmentTime = appointment.appointmentTime || defaultTime;
    const [hours, minutes] = appointmentTime.split(":");
    const endMinutes = String(parseInt(minutes || "0") + 30).padStart(2, "0");

    return {
      id: appointment.id,
      title: `${agent ? agent.name : "Unknown Agent"} - ${
        appointment.reason || "Consultation"
      }`,
      start: `${
        appointment.appointmentDate || "2025-10-29"
      }T${appointmentTime}`,
      end: `${appointment.appointmentDate || "2025-10-29"}T${
        hours || "09"
      }:${endMinutes}`,
      extendedProps: {
        agentId: appointment.agentId,
        customerId: appointment.customerId,
        status: appointment.status,
      },
      backgroundColor: getStatusColor(appointment.status),
      borderColor: getStatusColor(appointment.status),
    };
  });

  function getStatusColor(status) {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return "#1976d2";
      case "completed":
        return "#2e7d32";
      case "cancelled":
        return "#c62828";
      case "pending":
        return "#f57c00";
      default:
        return "#666";
    }
  }

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    const agent = agents.find((a) => a.id === event.extendedProps.agentId);
    const customer = users.find((u) => u.id === event.extendedProps.customerId);
    setSelectedEvent({
      agent: agent ? agent.name : "Unknown",
      date: event.start.toLocaleDateString(),
      time: event.start.toLocaleTimeString(),
      status: event.extendedProps.status,
      customer: customer ? customer.username : "Unknown Customer",
      color: getStatusColor(event.extendedProps.status),
    });
    setShowEventModal(true);
  };

  const handleDateSelect = async (selectInfo) => {
    const startDate = selectInfo.start;
    const endDate = selectInfo.end;

    // Check if the selected time is within business hours (9 AM to 6 PM)
    const hour = startDate.getHours();
    if (hour < 9 || hour >= 18) {
      alert("Please select a time between 9:00 AM and 6:00 PM");
      return;
    }

    // Format date and time for API
    const date = startDate.toISOString().split("T")[0];
    const time = startDate.toTimeString().slice(0, 5);

    // Check if any agent is available for this slot
    let availableAgent = null;
    for (const agent of agents) {
      if (agent.availability === "yes") {
        try {
          const response = await appointmentAPI.checkSlotAvailability(
            agent.id,
            date,
            time
          );
          if (response.data.available) {
            availableAgent = agent;
            break;
          }
        } catch (error) {
          console.error("Error checking availability:", error);
        }
      }
    }

    if (!availableAgent) {
      alert(
        "No agents are available for this time slot. Please select another time."
      );
      return;
    }

    // If we found an available agent, store the selection
    setSelectedSlot({
      date,
      time,
      agentId: availableAgent.id,
      agentName: availableAgent.name,
    });

    // Call the parent component's handler with the selected slot info
    if (onSlotSelect) {
      onSlotSelect({
        date,
        time,
        agentId: availableAgent.id,
        agentName: availableAgent.name,
      });
    }
  };

  return (
    <div
      className="calendar-container"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        padding: "20px",
        borderRadius: "12px",
        marginTop: "20px",
      }}
    >
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        eventClick={handleEventClick}
        height="auto"
        slotMinTime="09:00:00"
        slotMaxTime="18:00:00"
        allDaySlot={false}
        slotDuration="00:30:00"
        selectable={true}
        selectMirror={true}
        select={handleDateSelect}
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          meridiem: false,
          hour12: false,
        }}
        eventDisplay="block"
        eventContent={(eventInfo) => (
          <div className="fc-event-main-inner" style={{ padding: "2px 4px" }}>
            <div style={{ fontWeight: "bold", fontSize: "0.9em" }}>
              {eventInfo.event.title}
            </div>
            <div style={{ fontSize: "0.8em" }}>{eventInfo.timeText}</div>
          </div>
        )}
      />
      {showEventModal && selectedEvent && (
        <div
          className="event-modal-overlay"
          onClick={() => setShowEventModal(false)}
        >
          <div
            className="event-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="event-modal-header"
              style={{ backgroundColor: selectedEvent.color }}
            >
              <h3>Appointment Details</h3>
              <button
                className="close-button"
                onClick={() => setShowEventModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="event-modal-body">
              <div className="event-detail">
                <span className="detail-label">Agent</span>
                <span className="detail-value">{selectedEvent.agent}</span>
              </div>
              <div className="event-detail">
                <span className="detail-label">Date</span>
                <span className="detail-value">{selectedEvent.date}</span>
              </div>
              <div className="event-detail">
                <span className="detail-label">Time</span>
                <span className="detail-value">{selectedEvent.time}</span>
              </div>
              <div className="event-detail">
                <span className="detail-label">Status</span>
                <span
                  className="detail-value status-badge"
                  style={{ backgroundColor: selectedEvent.color }}
                >
                  {selectedEvent.status}
                </span>
              </div>
              <div className="event-detail">
                <span className="detail-label">Customer</span>
                <span className="detail-value">{selectedEvent.customer}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppointmentCalendar;
