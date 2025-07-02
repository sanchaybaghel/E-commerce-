import axios from './axios';

export const addReview = (productId, review) =>
  axios.post(`/api/products/${productId}/review`, review);

export const getProduct = (id) =>
  axios.get(`/api/products/${id}`);

export const addProduct = (formData) =>
  axios.post('/api/products', formData, {
    
    headers: { 'Content-Type': 'multipart/form-data' }
  });
export const editProduct = (id, product) => axios.put(`/api/products/${id}`, product);
export const deleteProduct = (id) => axios.delete(`/api/products/${id}`);
export const searchProducts = (params) =>
  axios.get('/api/products/search', { params });
export const createCheckoutSession = (productId, quantity) =>
  axios.post('/api/payment/create-checkout-session', { productId, quantity });
// Add this for admin:
export const getProducts = () => axios.get('/api/products', { withCredentials: true });