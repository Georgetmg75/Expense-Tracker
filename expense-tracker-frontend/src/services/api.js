// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // ✅ adjust for production if needed
  timeout: 10000, // ✅ 10s timeout for slow networks
});

// ✅ Attach token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.authorization = `Bearer ${token}`;
  }
  return req;
});

// ✅ Log errors globally (optional: trigger toast)
API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API error:', err?.response?.data?.message || err.message);
    return Promise.reject(err);
  }
);

export default API;
