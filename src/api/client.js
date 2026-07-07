import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  // Only attach if token exists and isn't "undefined" string
  if (token && token !== "undefined") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// NEW: Add a response interceptor to handle token errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Token expired or invalid. Clearing storage...");
      localStorage.removeItem('token');
      // Optional: window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default apiClient;