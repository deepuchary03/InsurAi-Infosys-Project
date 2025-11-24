# 📚 API Documentation

## Base URL

```
http://localhost:8081/api/v1
```

---

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Authentication Endpoints

### 1. Register User

**POST** `/auth/register`

Register a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "phoneNumber": "+1234567890",
  "address": "123 Main St",
  "role": "CUSTOMER"
}
```

**Response:** `200 OK`

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
  "tokenType": "Bearer",
  "userId": 1,
  "email": "user@example.com",
  "fullName": "John Doe",
  "roles": ["CUSTOMER"]
}
```

### 2. Login

**POST** `/auth/login`

Authenticate user and receive JWT tokens.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `200 OK` (same as register)

### 3. Refresh Token

**POST** `/auth/refresh`

Get a new access token using refresh token.

**Request Body:**

```json
{
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response:** `200 OK`

### 4. Logout

**POST** `/auth/logout`

Invalidate refresh token.

**Request Body:**

```json
{
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response:** `200 OK`

---

## Agent Endpoints

### 1. Get All Agents

**GET** `/agents`

Get list of all agents.

**Response:** `200 OK`

```json
[
  {
    "id": 1,
    "userId": 2,
    "fullName": "Dr. Sarah Johnson",
    "email": "sarah@example.com",
    "phoneNumber": "+1234567890",
    "specialization": "Life Insurance",
    "bio": "15 years of experience in life insurance",
    "profileImage": null,
    "experienceYears": 15,
    "rating": 4.8,
    "totalAppointments": 127,
    "isAvailable": true
  }
]
```

### 2. Get Available Agents

**GET** `/agents/available`

Get only agents who are currently available.

**Response:** `200 OK` (same structure as above)

### 3. Get Top Agents

**GET** `/agents/top`

Get top-rated agents sorted by rating.

**Response:** `200 OK` (same structure as above)

### 4. Get Agent by ID

**GET** `/agents/{id}`

Get specific agent details.

**Response:** `200 OK` (single agent object)

### 5. Get Agent by User ID

**GET** `/agents/user/{userId}`

Get agent profile for a specific user.

**Response:** `200 OK` (single agent object)

### 6. Create Agent Profile

**POST** `/agents`

Create a new agent profile (requires AGENT role).

**Request Body:**

```json
{
  "userId": 2,
  "specialization": "Life Insurance",
  "bio": "Expert in life and health insurance",
  "experienceYears": 10
}
```

**Response:** `200 OK` (agent object)

### 7. Update Agent

**PUT** `/agents/{id}`

Update agent profile.

**Request Body:** (same as create, all fields optional)

**Response:** `200 OK` (updated agent object)

---

## Agent Availability Endpoints

### 1. Get Agent Availability

**GET** `/availability/agent/{agentId}`

Get all availability slots for an agent.

**Response:** `200 OK`

```json
[
  {
    "id": 1,
    "agentId": 1,
    "agentName": "Dr. Sarah Johnson",
    "date": "2025-11-25",
    "startTime": "09:00:00",
    "endTime": "10:00:00",
    "isBooked": false
  }
]
```

### 2. Get Available Slots

**GET** `/availability/agent/{agentId}/available?fromDate=2025-11-25`

Get only unbooked slots from a specific date.

**Query Parameters:**

- `fromDate` (required): Start date (YYYY-MM-DD)

**Response:** `200 OK` (same structure)

### 3. Get Availability by Date

**GET** `/availability/agent/{agentId}/date/{date}`

Get all slots for a specific date.

**Response:** `200 OK`

### 4. Get Availability by Date Range

**GET** `/availability/agent/{agentId}/range?startDate=2025-11-25&endDate=2025-11-30`

Get slots within a date range.

**Query Parameters:**

- `startDate` (required): YYYY-MM-DD
- `endDate` (required): YYYY-MM-DD

**Response:** `200 OK`

### 5. Create Availability Slot

**POST** `/availability`

Create a new availability slot (requires AGENT role).

**Request Body:**

```json
{
  "agentId": 1,
  "date": "2025-11-25",
  "startTime": "09:00:00",
  "endTime": "10:00:00"
}
```

**Response:** `200 OK` (availability object)

### 6. Update Availability

**PUT** `/availability/{id}`

Update an availability slot.

**Request Body:** (same as create)

**Response:** `200 OK`

### 7. Delete Availability

**DELETE** `/availability/{id}`

Delete an availability slot (cannot delete if booked).

**Response:** `204 No Content`

---

## Appointment Endpoints

### 1. Get All Appointments

**GET** `/appointments`

Get all appointments (admin only).

**Response:** `200 OK`

```json
[
  {
    "id": 1,
    "customerId": 1,
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "agentId": 1,
    "agentName": "Dr. Sarah Johnson",
    "agentSpecialization": "Life Insurance",
    "appointmentDateTime": "2025-11-25T10:00:00",
    "status": "CONFIRMED",
    "type": "CONSULTATION",
    "notes": "Interested in life insurance policy",
    "cancellationReason": null,
    "createdAt": "2025-11-20T14:30:00"
  }
]
```

### 2. Get Appointment by ID

**GET** `/appointments/{id}`

Get specific appointment details.

**Response:** `200 OK` (single appointment object)

### 3. Get Customer Appointments

**GET** `/appointments/customer/{customerId}`

Get all appointments for a customer.

**Response:** `200 OK` (array of appointments)

### 4. Get Agent Appointments

**GET** `/appointments/agent/{agentId}`

Get all appointments for an agent.

**Response:** `200 OK` (array of appointments)

### 5. Get Appointments by Date Range

**GET** `/appointments/range?startDate=2025-11-25T00:00:00&endDate=2025-11-30T23:59:59`

Get appointments within a date range.

**Query Parameters:**

- `startDate` (required): ISO DateTime
- `endDate` (required): ISO DateTime

**Response:** `200 OK`

### 6. Create Appointment

**POST** `/appointments`

Book a new appointment.

**Request Body:**

```json
{
  "customerId": 1,
  "agentId": 1,
  "appointmentDateTime": "2025-11-25T10:00:00",
  "type": "CONSULTATION",
  "notes": "Need advice on life insurance"
}
```

**Appointment Types:**

- `CONSULTATION`
- `CLAIM_ASSISTANCE`
- `POLICY_REVIEW`
- `NEW_POLICY`
- `RENEWAL`
- `OTHER`

**Response:** `200 OK` (appointment object)

### 7. Update Appointment Status

**PUT** `/appointments/{id}/status`

Update appointment status (agent can confirm/cancel).

**Request Body:**

```json
{
  "status": "CONFIRMED",
  "reason": null
}
```

**Status Options:**

- `PENDING`
- `CONFIRMED`
- `CANCELLED`
- `COMPLETED`
- `NO_SHOW`

**Response:** `200 OK` (updated appointment)

### 8. Delete Appointment

**DELETE** `/appointments/{id}`

Cancel/delete an appointment.

**Response:** `204 No Content`

---

## AI Assistant Endpoints

### 1. Process AI Query

**POST** `/ai/query`

Send a question to the AI assistant powered by Google Gemini.

**Request Body:**

```json
{
  "question": "What types of insurance do you offer?",
  "isVoiceQuery": false,
  "userId": 1
}
```

**Response:** `200 OK`

```json
{
  "answer": "We offer a comprehensive range of insurance products including Life Insurance, Health Insurance, Auto Insurance, Home Insurance, Business Insurance, Travel Insurance, and Disability Insurance. Each product is designed to provide tailored coverage...",
  "category": "GENERAL",
  "responseTime": 1234,
  "canBookAppointment": false,
  "suggestedAction": null
}
```

**Query Categories:**

- `LIFE_INSURANCE`
- `HEALTH_INSURANCE`
- `AUTO_INSURANCE`
- `HOME_INSURANCE`
- `CLAIMS`
- `APPOINTMENT`
- `POLICY_INQUIRY`
- `PRICING`
- `GENERAL`

---

## Admin Endpoints

**Note:** Requires ADMIN role for all endpoints.

### 1. Get Admin Analytics

**GET** `/admin/analytics`

Get comprehensive system analytics.

**Response:** `200 OK`

```json
{
  "totalAppointments": 150,
  "pendingAppointments": 10,
  "confirmedAppointments": 80,
  "completedAppointments": 50,
  "cancelledAppointments": 10,
  "totalUsers": 100,
  "totalAgents": 10,
  "totalPolicies": 75,
  "totalAIQueries": 500,
  "appointmentsByType": {
    "CONSULTATION": 60,
    "CLAIM_ASSISTANCE": 30,
    "POLICY_REVIEW": 40,
    "NEW_POLICY": 15,
    "RENEWAL": 5
  },
  "appointmentsByAgent": {
    "Dr. Sarah Johnson": 45,
    "John Smith": 38
  },
  "appointmentsByStatus": {
    "PENDING": 10,
    "CONFIRMED": 80,
    "COMPLETED": 50,
    "CANCELLED": 10
  },
  "weeklyStats": [
    {
      "date": "2025-11-18",
      "day": "MONDAY",
      "total": 15,
      "confirmed": 10,
      "pending": 3,
      "cancelled": 2
    }
  ],
  "monthlyStats": [
    {
      "month": "NOVEMBER",
      "year": 2025,
      "total": 50,
      "completed": 35
    }
  ],
  "aiQueryCategories": {
    "LIFE_INSURANCE": 150,
    "HEALTH_INSURANCE": 100,
    "GENERAL": 250
  },
  "averageResponseTime": 1500.5
}
```

### 2. Get Monthly Analytics

**GET** `/admin/analytics/monthly`

Get appointment counts by month for last 6 months.

**Response:** `200 OK`

```json
{
  "Jun 2025": 45,
  "Jul 2025": 52,
  "Aug 2025": 48,
  "Sep 2025": 60,
  "Oct 2025": 55,
  "Nov 2025": 50
}
```

---

## Health Check

### Get System Health

**GET** `/health`

Check if the API is running (public endpoint).

**Response:** `200 OK`

```json
{
  "status": "UP",
  "service": "Online Corporate Insurance System",
  "version": "1.0.0",
  "timestamp": "2025-11-23T10:30:00"
}
```

---

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request

```json
{
  "error": "Invalid request format",
  "message": "Email is required",
  "timestamp": "2025-11-23T10:30:00"
}
```

### 401 Unauthorized

```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token",
  "timestamp": "2025-11-23T10:30:00"
}
```

### 403 Forbidden

```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions",
  "timestamp": "2025-11-23T10:30:00"
}
```

### 404 Not Found

```json
{
  "error": "Not Found",
  "message": "Resource not found",
  "timestamp": "2025-11-23T10:30:00"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred",
  "timestamp": "2025-11-23T10:30:00"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production:

- Recommended: 100 requests per minute per IP
- Authenticated: 1000 requests per hour per user

---

## Pagination

Not implemented in MVP. For production, add query parameters:

- `page` (default: 0)
- `size` (default: 20)
- `sort` (e.g., "createdAt,desc")

---

## Testing with cURL

### Register and Login

```bash
# Register
curl -X POST http://localhost:8081/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User",
    "role": "CUSTOMER"
  }'

# Login
curl -X POST http://localhost:8081/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Agents (with token)

```bash
curl -X GET http://localhost:8081/api/v1/agents \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Book Appointment

```bash
curl -X POST http://localhost:8081/api/v1/appointments \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "agentId": 1,
    "appointmentDateTime": "2025-11-25T10:00:00",
    "type": "CONSULTATION",
    "notes": "Need insurance advice"
  }'
```

### AI Query

```bash
curl -X POST http://localhost:8081/api/v1/ai/query \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is life insurance?",
    "isVoiceQuery": false,
    "userId": 1
  }'
```

---

## Postman Collection

Import this collection for easier testing:

```json
{
  "info": {
    "name": "Insurance System API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{jwt_token}}",
        "type": "string"
      }
    ]
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:8081/api/v1"
    }
  ]
}
```

---

**API Version:** 1.0.0  
**Last Updated:** November 23, 2025
