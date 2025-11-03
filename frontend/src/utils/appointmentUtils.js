// Function to check and update appointment status
export const checkAppointmentStatus = (appointment) => {
  const now = new Date();
  
  // Parse the appointment date and time
  let appointmentDateTime;
  if (appointment.appointmentTime) {
    appointmentDateTime = new Date(`${appointment.appointmentDate}T${appointment.appointmentTime}`);
  } else {
    // If no specific time is set, assume it's end of day
    appointmentDateTime = new Date(`${appointment.appointmentDate}T23:59:59`);
  }
  
  // Add business duration (e.g., 1 hour) to appointment time for end time
  const appointmentEndTime = new Date(appointmentDateTime.getTime() + 60 * 60000);
  
  // Get start of current day for date comparison
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  
  // Get appointment date for comparison
  const appointmentDate = new Date(appointment.appointmentDate);
  appointmentDate.setHours(0, 0, 0, 0);

  // Status update logic
  if (appointment.status === 'cancelled') {
    return 'cancelled';
  } else if (now > appointmentEndTime) {
    // Past appointments should be marked as completed
    return 'completed';
  } else if (appointmentDate.getTime() === todayStart.getTime()) {
    // Today's appointments
    if (now > appointmentDateTime) {
      return 'completed';
    } else {
      return 'today';
    }
  } else if (appointmentDate < todayStart) {
    // Past date appointments should be completed
    return 'completed';
  } else {
    // Future appointments remain scheduled
    return 'scheduled';
  }
};

// Function to process all appointments
export const processAppointments = (appointments) => {
  return appointments.map(appointment => ({
    ...appointment,
    status: checkAppointmentStatus(appointment)
  }));
};