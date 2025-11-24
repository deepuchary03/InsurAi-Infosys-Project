import axios from "axios";

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/api`
  : "http://localhost:8081/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const userAPI = {
  login: (credentials) => api.post("/users/login", credentials),
  register: (userData) => api.post("/users/register", userData),
  getAllUsers: () => api.get("/users"),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  updateProfile: (id, profileData) =>
    api.put(`/users/${id}/profile`, profileData),
  getProfile: (id) => api.get(`/users/${id}/profile`),
  deleteUser: (id) => api.delete(`/users/${id}`),
  verifyEmail: (token) => api.post("/users/verify-email", { token }),
  forgotPassword: (email) => api.post("/users/forgot-password", { email }),
  resetPassword: (token, password) =>
    api.post("/users/reset-password", { token, password }),
};

export const agentAPI = {
  getAllAgents: () => api.get("/agents"),
  // Fetch agents visible to customers (availability='yes' and not booked by others,
  // or agents booked by the requesting customer)
  getAvailableAgents: (customerId) =>
    api.get(
      `/agents/available${customerId ? "?customerId=" + customerId : ""}`
    ),
  getAgentById: (id) => api.get(`/agents/${id}`),
  getAgentByUserId: (userId) => api.get(`/agents/user/${userId}`),
  createAgent: (agentData) => api.post("/agents", agentData),
  updateAgent: (id, agentData) => api.put(`/agents/${id}`, agentData),
  deleteAgent: (id) => api.delete(`/agents/${id}`),
};

export const appointmentAPI = {
  getAllAppointments: () => api.get("/appointments"),
  getAppointmentById: (id) => api.get(`/appointments/${id}`),
  getAppointmentsByCustomer: (customerId) =>
    api.get(`/appointments/customer/${customerId}`),
  getAppointmentsByAgent: (agentId) =>
    api.get(`/appointments/agent/${agentId}`),
  createAppointment: (appointmentData) =>
    api.post("/appointments", appointmentData),
  updateAppointment: (id, appointmentData) =>
    api.put(`/appointments/${id}`, appointmentData),
  deleteAppointment: (id) => api.delete(`/appointments/${id}`),
};

export const planAPI = {
  getAllPlans: () => api.get("/plans"),
  createPlan: (planData) => api.post("/plans", planData),
  updatePlan: (id, planData) => api.put(`/plans/${id}`, planData),
  deletePlan: (id) => api.delete(`/plans/${id}`),
};

export const notificationAPI = {
  getAllNotifications: () => api.get("/notifications"),
  getNotificationsByRecipient: (recipientId) =>
    api.get(`/notifications/recipient/${recipientId}`),
  getPendingNotifications: () => api.get("/notifications/pending"),
  createNotification: (notificationData) =>
    api.post("/notifications", notificationData),
};

export const chatAPI = {
  sendMessage: (message) => api.post("/chat", { message }),
  sendVoiceMessage: (voiceText, userId = null) =>
    api.post("/chat/voice", { voiceText, userId }),
};

// Utility function to format currency in Indian Rupees
export const formatINR = (amount) => {
  if (amount == null || amount === undefined) return "₹0";
  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

export default api;
