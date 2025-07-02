import axios from './axios';

export const getOrders = () => axios.get('/api/user/orders');
export const getOrder = (orderId) => axios.get(`/api/user/orders/${orderId}`);
export const getMyOrders = () => axios.get('/api/orders/my', { withCredentials: true });
export const getAllOrders = () => axios.get('/api/admin/orders', { withCredentials: true });
export const updateCustomerOrderStatus = (orderId, status, reason) =>
  axios.put(`/api/orders/${orderId}/customer-status`, { status, reason });