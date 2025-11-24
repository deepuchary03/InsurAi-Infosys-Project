# Group C

## GitHub Collaborator Status

| S.No | Name                      | Status                                         |
| ---- | ------------------------- | ---------------------------------------------- |
| 1    | Sangoji Pranav            | joined                                         |
| 2    | Rakesh Kummari            | joined                                         |
| 3    | MURABOYINA HARSHINI PRIYA | joined                                         |
| 4    | Mithunraj M               | joined                                         |

#### **Mentor:** Niti-Dwivedi — Invitation sent

# 🎯 Project Overview

A comprehensive AI-powered online insurance management system built with **React**, **Spring Boot**, **MySQL**, and **Google Gemini AI**. This MVP enables customers to manage insurance policies, schedule appointments with agents, and get instant answers using voice-enabled AI assistance.

---
## Deployed Url: https://deepuchary-insurai.vercel.app/
---

## ✨ Features

### 👥 **Customer Features**

- ✅ User registration and JWT-based authentication
- ✅ Browse available insurance agents
- ✅ Schedule appointments with agents
- ✅ AI-powered insurance query assistant (voice + text)
- ✅ View and manage appointments
- ✅ View insurance policies
- ✅ Email notifications for appointments

### 🤝 **Agent Features**

- ✅ Agent profile management
- ✅ Set and manage availability slots (CRUD)
- ✅ View incoming appointments
- ✅ Confirm/cancel appointments
- ✅ Track appointment statistics

### 🔐 **Admin Features**

- ✅ Comprehensive analytics dashboard
- ✅ Monthly appointment calendar (FullCalendar.js)
- ✅ Pie chart: Appointment distribution by status/type
- ✅ Bar chart: Weekly/monthly appointment trends
- ✅ AI query analytics
- ✅ User, agent, and appointment management

---

## 🛠 Tech Stack

### **Frontend**

- React 18.2 with Vite
- React Router v6 for routing
- Tailwind CSS for styling
- FullCalendar.js for calendar views
- Recharts for data visualization
- Axios for API calls
- React Hook Form for form management
- Lucide React for icons

### **Backend**

- Spring Boot 3.2
- Spring Security with JWT authentication
- Spring Data JPA with Hibernate
- MySQL 8.0 database
- JavaMailSender for email notifications
- WebFlux for AI API integration

### **AI & External Services**

- Google Gemini API for AI queries
- Web Speech API for voice recognition
- Gmail SMTP for email notifications

---

## 📁 Project Structure

```
mvp/
├── backend/                          # Spring Boot Backend
│   ├── src/main/java/com/insurance/
│   │   ├── InsuranceSystemApplication.java
│   │   ├── config/
│   │   │   ├── JwtTokenProvider.java
│   │   │   ├── JwtAuthenticationFilter.java
│   │   │   └── SecurityConfig.java
│   │   ├── controller/
│   │   │   ├── AuthController.java
│   │   │   ├── AgentController.java
│   │   │   ├── AgentAvailabilityController.java
│   │   │   ├── AppointmentController.java
│   │   │   ├── AIController.java
│   │   │   └── AdminController.java
│   │   ├── dto/
│   │   │   ├── AuthResponse.java
│   │   │   ├── AppointmentDTO.java
│   │   │   ├── AgentDTO.java
│   │   │   └── AnalyticsDTO.java
│   │   ├── entity/
│   │   │   ├── User.java
│   │   │   ├── Agent.java
│   │   │   ├── AgentAvailability.java
│   │   │   ├── Appointment.java
│   │   │   ├── InsurancePolicy.java
│   │   │   ├── AIQueryLog.java
│   │   │   └── Notification.java
│   │   ├── repository/
│   │   │   ├── UserRepository.java
│   │   │   ├── AgentRepository.java
│   │   │   ├── AppointmentRepository.java
│   │   │   └── AIQueryLogRepository.java
│   │   └── service/
│   │       ├── AuthService.java
│   │       ├── AgentService.java
│   │       ├── AppointmentService.java
│   │       ├── AIService.java
│   │       ├── EmailService.java
│   │       ├── NotificationService.java
│   │       └── AnalyticsService.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
└── frontend/                         # React Frontend
    ├── public/
    ├── src/
    │   ├── components/
    │   │   └── Layout.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── CustomerDashboard.jsx
    │   │   ├── AgentDashboard.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   ├── Appointments.jsx
    │   │   ├── BookAppointment.jsx
    │   │   ├── Agents.jsx
    │   │   └── AIAssistant.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── utils/
    │   │   ├── auth.js
    │   │   ├── dateFormatter.js
    │   │   └── constants.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    ├── vite.config.js
    └── tailwind.config.js
```

---
