import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://e-commerce-h7qv.onrender.com',
  withCredentials: true // Always send cookies for authentication
});

export default instance;