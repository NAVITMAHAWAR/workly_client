import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://10.121.52.123:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH APIs (OTP Based) ====================
export const authOtpAPI = {
  sendRegistrationOTP: (data) =>
    api.post("/api/auth/send-registration-otp", data),
  verifyRegistrationOTP: (data) =>
    api.post("/api/auth/verify-registration-otp", data),
  resendOTP: (data) => api.post("/api/auth/resend-otp", data),
  login: (data) => api.post("/api/auth/login", data),
};

// ==================== PROFILE COMPLETION APIs ====================
export const profileAPI = {
  getProfileStatus: () => api.get("/api/profile/status"),
  completeClientProfile: (data) =>
    api.post("/api/profile/complete-client-profile", data),
  completeFreelancerProfile: (data) =>
    api.post("/api/profile/complete-freelancer-profile", data),
  getClientProfile: () => api.get("/api/profile/client"),
  updateClientProfile: (data) =>
    api.put("/api/profile/client", data),
  getFreelancerProfile: () => api.get("/api/profile/freelancer"),
  updateFreelancerProfile: (data) =>
    api.put("/api/profile/freelancer", data),
};

// ==================== AUTH APIs (Legacy) ====================
export const authAPI = {
  register: (data) => api.post("/api/auth/register", data),
  login: (data) => api.post("/api/auth/login", data),
  getMyProfile: () => api.get("/api/auth/getmyprofile"),
  completeProfile: (data) => api.post("/api/auth/completeprofile", data),
  updateProfile: (data) => api.put("/api/auth/updateprofile", data),
  getMyContracts: () => api.get("/api/auth/getmycontracts"),
  getContractDetails: (contractId) =>
    api.get("/api/auth/getcontractdetails", { params: { contractId } }),
  getNotifications: () => api.get("/api/auth/getnotifications"),
  markAllNotificationsRead: () =>
    api.get("/api/auth/markallnotificationread"),
  markNotificationRead: (notificationId) =>
    api.get("/api/auth/marknotificationread", { params: { notificationId } }),
};

// ==================== CLIENT APIs ====================
export const clientAPI = {
  createJob: (data) => api.post("/api/client/createjobs", data),
  getMyJobs: () => api.get("/api/client/getmyjobs"),
  getJobProposals: (jobId) =>
    api.get("/api/client/getjobproposals", { params: { jobId } }),
  getJobProposalById: (proposalId) =>
    api.get("/api/client/getjobproposalsbyid", { params: { proposalId } }),
  updateProposalStatus: (data) =>
    api.patch("/api/client/updateproposalstatus", data),
  completeContract: (contractId) =>
    api.patch(`/api/client/completecontract?id=${contractId}`),
  createReview: (data) => api.post("/api/client/createReview", data),
  getFreelancers: (search = "") =>
    api.get("/api/client/getfreelincers", { params: { search } }),
  getFreelancerById: (freelancerId) =>
    api.get("/api/client/getfreelincerbyid", { params: { freelancerId } }),
  getClientDashboard: () => api.get("/api/client/dashboard"),
};

// ==================== FREELANCER APIs ====================
export const freelancerAPI = {
  getJobs: () => api.get("/api/freelancer/getjobs"),
  getJobById: (jobId) =>
    api.get("/api/freelancer/getjobbyid", { params: { jobId } }),
  createProposal: (data) => api.post("/api/freelancer/createproposal", data),
  getMyProposals: () => api.get("/api/freelancer/getmyjobproposals"),
  createPortfolio: (data) =>
    api.post("/api/freelancer/createportfolio", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getMyPortfolio: () => api.get("/api/freelancer/getmyportfolio"),
  updatePortfolio: (data) =>
    api.put("/api/freelancer/updateportfolio", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deletePortfolio: (portfolioId) =>
    api.delete("/api/freelancer/deleteportfolio", { params: { id: portfolioId } }),
  submitWork: (data) =>
    api.post("/api/freelancer/submitwork", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getFreelancerDashboard: () =>
    api.get("/api/freelancer/freelincerdashboard"),
  saveJob: (jobId) => api.post("/api/freelancer/savedjobs", { jobId }),
  unsaveJob: (jobId) => api.post("/api/freelancer/unsavedjob", { jobId }),
  getSavedJobs: () => api.get("/api/freelancer/getsavedjobs"),
  getNotifications: (limit = 10, offset = 0, unreadOnly = false) =>
    api.get("/api/freelancer/notifications", { params: { limit, offset, unreadOnly } }),
  markNotificationAsRead: (notificationId) =>
    api.post("/api/freelancer/notifications/mark-read", { notificationId }),
  markAllNotificationsAsRead: () =>
    api.post("/api/freelancer/notifications/mark-all-read"),
};

// ==================== CHAT APIs ====================
export const chatAPI = {
  startConversation: (contractId) =>
    api.post("/api/chat/start", { contractId }),
  getMyConversations: (limit = 20, offset = 0) =>
    api.get("/api/chat/conversations", { params: { limit, offset } }),
  getConversation: (conversationId) =>
    api.get("/api/chat/conversation", { params: { conversationId } }),
  sendMessage: (conversationId, content) =>
    api.post("/api/chat/send", { conversationId, content }),
  getMessages: (conversationId, limit = 20, offset = 0) =>
    api.get("/api/chat/messages", {
      params: { conversationId, limit, offset },
    }),
  markMessagesRead: (conversationId) =>
    api.patch("/api/chat/mark-read", { conversationId }),
  getUnreadCount: () => api.get("/api/chat/unread-count"),
  checkChatPermission: (freelancerId) =>
    api.get("/api/chat/check-permission", { params: { freelancerId } }),
};

export default api;
