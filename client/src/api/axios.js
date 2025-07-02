import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://e-commerce-h7qv.onrender.com',
  withCredentials: true // <-- add this line
});

// Add a request interceptor to set Authorization header if token exists
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // or use your auth context
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Remove token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;