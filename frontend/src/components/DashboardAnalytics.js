import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './DashboardAnalytics.css';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function DashboardAnalytics({ appointments }) {
  // Process appointments for status distribution
  const statusCounts = appointments.reduce((acc, appointment) => {
    const status = appointment.status?.toLowerCase();
    if (status) {
      acc[status] = (acc[status] || 0) + 1;
    }
    return acc;
  }, {});

  const pieChartData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 206, 86, 0.8)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Process appointments for monthly distribution
  const monthlyData = appointments.reduce((acc, appointment) => {
    const month = new Date(appointment.appointmentDate).getMonth();
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const barChartData = {
    labels: monthNames,
    datasets: [
      {
        label: 'Appointments per Month',
        data: monthNames.map((_, index) => monthlyData[index] || 0),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Appointment Distribution',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Appointment Status Distribution',
      },
    },
  };

  return (
    <div className="analytics-container">
      <div className="analytics-grid">
        <div className="chart-card">
          <h3>Status Distribution</h3>
          <div className="pie-chart-container">
            <Pie data={pieChartData} options={pieOptions} />
          </div>
        </div>
        <div className="chart-card">
          <h3>Monthly Overview</h3>
          <div className="bar-chart-container">
            <Bar data={barChartData} options={barOptions} />
          </div>
        </div>
        <div className="stats-card">
          <h3>Quick Stats</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Total Appointments</span>
              <span className="stat-value">{appointments.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Completed</span>
              <span className="stat-value">{statusCounts['completed'] || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Scheduled</span>
              <span className="stat-value">{statusCounts['scheduled'] || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Cancelled</span>
              <span className="stat-value">{statusCounts['Cancelled'] || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardAnalytics;