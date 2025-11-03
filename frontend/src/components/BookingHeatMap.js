import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import './BookingHeatMap.css';

function BookingHeatMap({ appointments }) {
  const getIntensityLevel = (count) => {
    if (count <= 2) return 1;
    if (count <= 4) return 2;
    if (count <= 6) return 3;
    if (count <= 8) return 4;
    return 5;
  };

  // Process appointments into a heatmap format
  const events = appointments.reduce((acc, appointment) => {
    const date = appointment.appointmentDate;
    const existingEvent = acc.find(e => e.start === date);
    
    if (existingEvent) {
      existingEvent.extendedProps.bookingCount++;
      const level = getIntensityLevel(existingEvent.extendedProps.bookingCount);
      existingEvent.classNames = [`heat-level-${level}`];
      existingEvent.backgroundColor = `var(--heat-level-${level}-color)`;
    } else {
      acc.push({
        start: date,
        end: date,
        display: 'background',
        classNames: ['heat-level-1'],
        backgroundColor: 'var(--heat-level-1-color)',
        extendedProps: { 
          bookingCount: 1
        }
      });
    }
    
    return acc;
  }, []);

  return (
    <div className="heatmap-container glass-card">
      <div className="heatmap-header">
        <h3>Booking Activity Heatmap</h3>
        <div className="heatmap-legend">
          <div className="legend-title">Booking Intensity:</div>
          <div className="legend-items">
            <div className="legend-item">
              <span className="color-box heat-level-1"></span>
              <span>1-2</span>
            </div>
            <div className="legend-item">
              <span className="color-box heat-level-2"></span>
              <span>3-4</span>
            </div>
            <div className="legend-item">
              <span className="color-box heat-level-3"></span>
              <span>5-6</span>
            </div>
            <div className="legend-item">
              <span className="color-box heat-level-4"></span>
              <span>7-8</span>
            </div>
            <div className="legend-item">
              <span className="color-box heat-level-5"></span>
              <span>9+</span>
            </div>
          </div>
        </div>
      </div>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: ''
        }}
        events={events}
        height={550}
        contentHeight={500}
        dayMaxEvents={0}
        eventDisplay="background"
        eventContent={(arg) => (
          <div className="heat-event-content">
            <div className="booking-count">{arg.event.extendedProps.bookingCount}</div>
          </div>
        )}
      />
    </div>
  );
}

export default BookingHeatMap;