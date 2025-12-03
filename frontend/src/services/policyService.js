import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

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
  (error) => Promise.reject(error)
);

// Policy API
export const policyService = {
  purchasePolicy: (data) => api.post("/policies/purchase", data),
  getPoliciesByCustomer: (customerId) =>
    api.get(`/policies/customer/${customerId}`),
  getPoliciesByAgent: (agentId) => api.get(`/policies/agent/${agentId}`),
  getAllPolicies: () => api.get("/policies"),
  getPolicyById: (id) => api.get(`/policies/${id}`),
  getPolicyByNumber: (policyNumber) =>
    api.get(`/policies/number/${policyNumber}`),
  updatePolicy: (id, data) => api.put(`/policies/${id}`, data),
  cancelPolicy: (id, reason) => api.post(`/policies/${id}/cancel`, { reason }),
  deletePolicy: (id) => api.delete(`/policies/${id}`),
};

export default api;
