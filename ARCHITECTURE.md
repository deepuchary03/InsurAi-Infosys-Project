# 📊 System Architecture

## Overview

The Online Corporate Insurance System follows a modern **three-tier architecture** with:

- **Presentation Layer** (React Frontend)
- **Application Layer** (Spring Boot Backend)
- **Data Layer** (MySQL Database)

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT BROWSER                            │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           React SPA (Port 3000)                      │   │
│  │                                                       │   │
│  │  • React Router for navigation                       │   │
│  │  • Axios for HTTP requests                           │   │
│  │  • JWT token management                              │   │
│  │  • FullCalendar.js for calendar views               │   │
│  │  • Recharts for data visualization                   │   │
│  │  • Web Speech API for voice recognition             │   │
│  │  • Tailwind CSS for styling                         │   │
│  └──────────────────┬───────────────────────────────────┘   │
└────────────────────┼────────────────────────────────────────┘
                      │
                      │ HTTP/HTTPS (REST API)
                      │ Authorization: Bearer <JWT>
                      │
┌─────────────────────▼────────────────────────────────────────┐
│              SPRING BOOT APPLICATION (Port 8081)              │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Security Layer                           │  │
│  │  • JWT Authentication Filter                         │  │
│  │  • JWT Token Provider                                │  │
│  │  • Spring Security Configuration                     │  │
│  │  • Role-based Access Control                         │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │                                        │
│  ┌──────────────────▼───────────────────────────────────┐  │
│  │              REST Controllers                         │  │
│  │  • AuthController                                    │  │
│  │  • AgentController                                   │  │
│  │  • AppointmentController                             │  │
│  │  • AIController                                      │  │
│  │  • AdminController                                   │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │                                        │
│  ┌──────────────────▼───────────────────────────────────┐  │
│  │              Service Layer                            │  │
│  │  • AuthService                                       │  │
│  │  • AgentService                                      │  │
│  │  • AppointmentService                                │  │
│  │  • AIService (Gemini Integration)                    │  │
│  │  • EmailService (SMTP)                               │  │
│  │  • NotificationService                               │  │
│  │  • AnalyticsService                                  │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │                                        │
│  ┌──────────────────▼───────────────────────────────────┐  │
│  │              Repository Layer                         │  │
│  │  • Spring Data JPA Repositories                      │  │
│  │  • Custom Query Methods                              │  │
│  └──────────────────┬───────────────────────────────────┘  │
└────────────────────┼────────────────────────────────────────┘
                      │
                      │ JDBC
                      │
┌─────────────────────▼────────────────────────────────────────┐
│                   MySQL Database                              │
│                                                               │
│  Tables:                                                      │
│  • users                                                      │
│  • agents                                                     │
│  • agent_availability                                         │
│  • appointments                                               │
│  • insurance_policies                                         │
│  • ai_query_logs                                             │
│  • notifications                                              │
│  • refresh_tokens                                             │
└───────────────────────────────────────────────────────────────┘

External Services:
┌─────────────────────────────────────┐
│   Google Gemini API                 │
│   (AI Query Processing)             │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   Gmail SMTP Server                 │
│   (Email Notifications)             │
└─────────────────────────────────────┘
```

---

## Component Interaction Flow

### **1. User Authentication Flow**

```
User → Login Page → POST /api/v1/auth/login
                    ↓
            AuthController
                    ↓
            AuthService
                    ↓
        UserRepository (DB)
                    ↓
    JWT Token Generation
                    ↓
    Return: { accessToken, refreshToken, user }
                    ↓
    Store in localStorage
                    ↓
    Redirect to Dashboard
```

### **2. Appointment Booking Flow**

```
Customer → Select Agent → Select Time Slot → Confirm
                    ↓
        POST /api/v1/appointments
                    ↓
        AppointmentController
                    ↓
        AppointmentService
                    ↓
    • Save appointment to DB
    • Update agent availability
    • Send email notification
    • Create notification record
                    ↓
        Return AppointmentDTO
                    ↓
    Display confirmation & send email
```

### **3. AI Query Processing Flow**

```
User → Type/Speak Query → POST /api/v1/ai/query
                    ↓
            AIController
                    ↓
            AIService
                    ↓
    • Build insurance-specific prompt
    • Call Google Gemini API
    • Categorize query
    • Detect appointment intent
    • Log query to database
                    ↓
        Return AI Response
                    ↓
    Display to user + action buttons
```

### **4. Admin Analytics Flow**

```
Admin → Dashboard → GET /api/v1/admin/analytics
                    ↓
        AdminController
                    ↓
        AnalyticsService
                    ↓
    • Query all appointments
    • Calculate statistics
    • Group by status/type/agent
    • Calculate weekly/monthly trends
    • Get AI query stats
                    ↓
        Return AnalyticsDTO
                    ↓
    Render Charts & Calendar
```

---

## Database Schema (ER Diagram)

```
┌──────────────────┐
│      users       │
├──────────────────┤
│ id (PK)          │
│ email            │◄─────┐
│ password         │      │
│ full_name        │      │
│ phone_number     │      │
│ address          │      │
│ is_active        │      │
│ roles            │      │
│ created_at       │      │
└──────────────────┘      │
         │                │
         │ 1:1            │
         ▼                │
┌──────────────────┐      │
│     agents       │      │
├──────────────────┤      │
│ id (PK)          │      │
│ user_id (FK)     │──────┘
│ specialization   │
│ bio              │
│ experience_years │
│ rating           │
│ is_available     │
└──────────────────┘
         │
         │ 1:N
         ▼
┌──────────────────────┐
│ agent_availability   │
├──────────────────────┤
│ id (PK)              │
│ agent_id (FK)        │
│ date                 │
│ start_time           │
│ end_time             │
│ is_booked            │
└──────────────────────┘

┌──────────────────┐          ┌──────────────────┐
│      users       │          │     agents       │
│  (customers)     │          │                  │
└────────┬─────────┘          └────────┬─────────┘
         │                             │
         │ N:1                     1:N │
         └─────────┐         ┌─────────┘
                   ▼         ▼
         ┌────────────────────────┐
         │    appointments        │
         ├────────────────────────┤
         │ id (PK)                │
         │ customer_id (FK)       │
         │ agent_id (FK)          │
         │ availability_id (FK)   │
         │ appointment_datetime   │
         │ status                 │
         │ type                   │
         │ notes                  │
         └────────────────────────┘

┌──────────────────────┐
│ insurance_policies   │
├──────────────────────┤
│ id (PK)              │
│ customer_id (FK)     │
│ agent_id (FK)        │
│ policy_number        │
│ policy_name          │
│ type                 │
│ premium              │
│ coverage_amount      │
│ start_date           │
│ end_date             │
│ status               │
└──────────────────────┘

┌──────────────────┐
│ ai_query_logs    │
├──────────────────┤
│ id (PK)          │
│ user_id (FK)     │
│ question         │
│ answer           │
│ is_voice_query   │
│ category         │
│ response_time    │
│ created_at       │
└──────────────────┘

┌──────────────────┐
│  notifications   │
├──────────────────┤
│ id (PK)          │
│ user_id (FK)     │
│ appointment_id   │
│ type             │
│ subject          │
│ message          │
│ is_read          │
│ email_sent       │
│ created_at       │
└──────────────────┘
```

---

## Technology Stack Details

### **Frontend Technologies**

| Technology      | Version | Purpose                 |
| --------------- | ------- | ----------------------- |
| React           | 18.2    | UI Framework            |
| React Router    | 6.20    | Client-side routing     |
| Vite            | 5.0     | Build tool & dev server |
| Tailwind CSS    | 3.3     | Utility-first CSS       |
| FullCalendar    | 6.1     | Interactive calendar    |
| Recharts        | 2.10    | Chart library           |
| Axios           | 1.6     | HTTP client             |
| React Hook Form | 7.48    | Form management         |
| Lucide React    | 0.294   | Icon library            |

### **Backend Technologies**

| Technology      | Version | Purpose                        |
| --------------- | ------- | ------------------------------ |
| Spring Boot     | 3.2     | Application framework          |
| Spring Security | 3.2     | Authentication & authorization |
| Spring Data JPA | 3.2     | Database ORM                   |
| Hibernate       | 6.3     | JPA implementation             |
| MySQL Connector | 8.0     | Database driver                |
| JJWT            | 0.12    | JWT token handling             |
| Spring Mail     | 3.2     | Email service                  |
| WebFlux         | 3.2     | Reactive HTTP client           |

### **Database**

| Component     | Version | Purpose             |
| ------------- | ------- | ------------------- |
| MySQL         | 8.0+    | Relational database |
| Hibernate DDL | Auto    | Schema generation   |

### **External Services**

| Service           | Purpose                    |
| ----------------- | -------------------------- |
| Google Gemini API | AI-powered query responses |
| Gmail SMTP        | Email notifications        |
| Web Speech API    | Voice recognition          |

---

## Security Architecture

### **Authentication Flow**

1. User submits credentials
2. Backend validates and generates JWT tokens
3. Access token (1 hour expiry)
4. Refresh token (24 hour expiry)
5. Tokens stored in localStorage
6. Access token sent in Authorization header
7. Automatic refresh on expiry

### **Authorization Levels**

| Role     | Permissions                                            |
| -------- | ------------------------------------------------------ |
| CUSTOMER | View agents, book appointments, use AI assistant       |
| AGENT    | Manage availability, view appointments, confirm/cancel |
| ADMIN    | Full access, analytics, user management                |

### **Security Features**

- Password hashing with BCrypt
- JWT token validation on each request
- Role-based endpoint protection
- CORS configuration
- Refresh token rotation
- Password reset with secure tokens

---

## Scalability Considerations

### **Current MVP Limitations**

- Single-server deployment
- In-memory token management
- Basic error handling
- No caching layer

### **Production Enhancements**

- Redis for token storage
- Load balancing
- Database connection pooling
- CDN for static assets
- Microservices architecture
- Message queue for async tasks
- Enhanced logging & monitoring

---

## API Design Patterns

### **RESTful Principles**

- Resource-based URLs
- HTTP verbs (GET, POST, PUT, DELETE)
- JSON request/response format
- Proper status codes
- Pagination support (future)

### **Response Structure**

```json
{
  "data": { ... },
  "status": "success",
  "message": "Operation completed"
}
```

### **Error Handling**

```json
{
  "error": "Error message",
  "status": "error",
  "code": 400
}
```

---

This architecture provides a solid foundation for the MVP while allowing for future scalability and enhancements.
