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
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export const agentAPI = {
  getAllAgents: () => api.get("/agents"),
  getAgentById: (id) => api.get(`/agents/${id}`),
  createAgent: (agentData) => api.post("/agents", agentData),
  updateAgent: (id, agentData) => api.put(`/agents/${id}`, agentData),
  deleteAgent: (id) => api.delete(`/agents/${id}`),
};

export const appointmentAPI = {
  getAllAppointments: () => api.get("/appointments"),
  getAppointmentsByCustomer: (customerId) =>
    api.get(`/appointments/customer/${customerId}`),
  getAppointmentsByAgent: (agentId) =>
    api.get(`/appointments/agent/${agentId}`),
  createAppointment: (appointmentData) =>
    api.post("/appointments", appointmentData),
  deleteAppointment: (id) => api.delete(`/appointments/${id}`),
};

export const planAPI = {
  getAllPlans: () => api.get("/plans"),
  createPlan: (planData) => api.post("/plans", planData),
  updatePlan: (id, planData) => api.put(`/plans/${id}`, planData),
  deletePlan: (id) => api.delete(`/plans/${id}`),
};

export default api;
