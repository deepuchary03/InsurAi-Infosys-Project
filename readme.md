# 🏢 Online Corporate Insurance System - MVP

## 🎯 Project Overview

A comprehensive AI-powered online insurance management system built with **React**, **Spring Boot**, **MySQL**, and **Google Gemini AI**. This MVP enables customers to manage insurance policies, schedule appointments with agents, and get instant answers using voice-enabled AI assistance.

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

## 🚀 Setup Instructions

### **Prerequisites**

- Java 17 or higher
- Node.js 18+ and npm
- MySQL 8.0+
- Maven 3.6+
- Google Gemini API Key
- Gmail account for SMTP (optional)

---

## 📊 Database Setup

### **1. Create MySQL Database**

```sql
CREATE DATABASE insurance_db;
USE insurance_db;
```

The application will auto-create tables on first run using Hibernate DDL.

### **2. Database Schema (Auto-generated)**

**Main Tables:**

- `users` - User accounts (customers, agents, admin)
- `agents` - Agent profiles
- `agent_availability` - Agent available time slots
- `appointments` - Appointment bookings
- `insurance_policies` - Customer insurance policies
- `ai_query_logs` - AI interaction history
- `notifications` - User notifications
- `refresh_tokens` - JWT refresh tokens

---

## 🔧 Backend Setup

### **1. Navigate to backend directory**

```powershell
cd backend
```

### **2. Configure application.properties**

Edit `src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/insurance_db
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

# JWT Secret (generate a secure random string)
jwt.secret=YOUR_SECRET_KEY_HERE

# Google Gemini API
gemini.api.key=YOUR_GEMINI_API_KEY

# Email Configuration (Gmail)
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

### **3. Get Google Gemini API Key**

1. Visit https://makersuite.google.com/app/apikey
2. Create a new API key
3. Copy and paste into `application.properties`

### **4. Build and Run**

```powershell
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

Backend will start on **http://localhost:8081**

---

## 🎨 Frontend Setup

### **1. Navigate to frontend directory**

```powershell
cd frontend
```

### **2. Install dependencies**

```powershell
npm install
```

### **3. Create .env file (optional)**

```
VITE_API_URL=http://localhost:8081/api/v1
```

### **4. Run development server**

```powershell
npm run dev
```

Frontend will start on **http://localhost:3000**

---

## 📡 API Endpoints

### **Authentication**

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout user

### **Agents**

- `GET /api/v1/agents` - Get all agents
- `GET /api/v1/agents/available` - Get available agents
- `GET /api/v1/agents/{id}` - Get agent by ID
- `POST /api/v1/agents` - Create agent profile

### **Availability**

- `GET /api/v1/availability/agent/{agentId}` - Get agent availability
- `POST /api/v1/availability` - Create availability slot
- `PUT /api/v1/availability/{id}` - Update availability
- `DELETE /api/v1/availability/{id}` - Delete availability

### **Appointments**

- `GET /api/v1/appointments` - Get all appointments
- `GET /api/v1/appointments/customer/{id}` - Get customer appointments
- `GET /api/v1/appointments/agent/{id}` - Get agent appointments
- `POST /api/v1/appointments` - Book appointment
- `PUT /api/v1/appointments/{id}/status` - Update appointment status
- `DELETE /api/v1/appointments/{id}` - Cancel appointment

### **AI Assistant**

- `POST /api/v1/ai/query` - Process AI query

### **Admin Analytics**

- `GET /api/v1/admin/analytics` - Get comprehensive analytics
- `GET /api/v1/admin/analytics/monthly` - Get monthly stats

---

## 👤 Default User Accounts

After running the application, register users with these roles:

**Customer:**

- Email: `customer@example.com`
- Password: `password123`
- Role: `CUSTOMER`

**Agent:**

- Email: `agent@example.com`
- Password: `password123`
- Role: `AGENT`

**Admin:**

- Email: `admin@example.com`
- Password: `password123`
- Role: `ADMIN`

---

## 📈 Features Showcase

### **1. AI Assistant (Gemini Integration)**

- Voice recognition using Web Speech API
- Natural language insurance queries
- Auto-categorization of queries
- Appointment booking suggestions
- Response time tracking

### **2. Admin Dashboard Analytics**

**Calendar View:**

- Monthly appointment calendar
- Color-coded by status (Pending/Confirmed/Cancelled)
- Interactive event details

**Pie Chart:**

- Appointment distribution by status
- Appointment distribution by type

**Bar Chart:**

- Weekly appointment statistics
- Monthly appointment trends

### **3. Appointment Management**

- Multi-step booking process
- Agent selection
- Available time slot selection
- Email confirmations
- Status tracking (Pending → Confirmed → Completed)

---

## 🔐 Security Features

- **JWT Authentication** with access & refresh tokens
- **Password encryption** using BCrypt
- **Role-based access control** (CUSTOMER, AGENT, ADMIN)
- **CORS configuration** for frontend-backend communication
- **Secure password reset** with token expiry

---

## 📧 Email Notifications

Automated emails are sent for:

- ✅ Welcome email on registration
- ✅ Appointment confirmation
- ✅ Appointment cancellation
- ✅ Password reset

---

## 🎯 Testing the Application

### **1. Register Users**

- Create Customer, Agent, and Admin accounts

### **2. Agent Setup**

- Login as Agent
- Set availability slots

### **3. Book Appointment**

- Login as Customer
- Browse agents
- Select time slot
- Book appointment

### **4. AI Assistant**

- Click "AI Assistant"
- Type or speak a question
- Example: "What types of insurance do you offer?"

### **5. Admin Analytics**

- Login as Admin
- View dashboard with charts and calendar
- Monitor system statistics

---

## 🐛 Troubleshooting

### **Backend Issues**

**MySQL Connection Error:**

```
Check MySQL service is running
Verify credentials in application.properties
Ensure database 'insurance_db' exists
```

**JWT Errors:**

```
Ensure jwt.secret is configured
Check token expiration settings
```

### **Frontend Issues**

**API Connection Error:**

```
Verify backend is running on port 8081
Check CORS configuration
Inspect browser console for errors
```

**Build Errors:**

```powershell
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 🚀 Deployment

### **Backend Deployment**

**Build JAR:**

```powershell
mvn clean package
java -jar target/online-insurance-system-1.0.0.jar
```

**Environment Variables:**

```
DATABASE_URL=jdbc:mysql://your-db-host:3306/insurance_db
DATABASE_USERNAME=your-username
DATABASE_PASSWORD=your-password
JWT_SECRET=your-production-secret
GEMINI_API_KEY=your-api-key
```

### **Frontend Deployment**

**Build for production:**

```powershell
npm run build
```

Deploy the `dist/` folder to:

- Vercel
- Netlify
- AWS S3 + CloudFront
- Firebase Hosting

---

## 📄 License

This project is created for educational and demonstration purposes.

---

## 🤝 Contributing

This is an MVP project. For production use:

- Add comprehensive error handling
- Implement rate limiting
- Add input validation
- Enhance security measures
- Add unit and integration tests
- Implement logging and monitoring
- Add API documentation (Swagger)

---

## 📞 Support

For issues or questions:

- Check the troubleshooting section
- Review API endpoint documentation
- Verify environment configuration

---

## 🎉 Project Highlights

✅ **Complete authentication system** with JWT  
✅ **AI-powered assistant** using Google Gemini  
✅ **Voice recognition** for queries  
✅ **Interactive calendar** with FullCalendar.js  
✅ **Data visualization** with Recharts  
✅ **Email notifications**  
✅ **Role-based dashboards**  
✅ **Responsive design** with Tailwind CSS  
✅ **Professional UI/UX**

---

**Built with ❤️ for modern insurance management**
