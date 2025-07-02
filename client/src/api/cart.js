import axios from './axios';

export const getCart = () => axios.get('/api/cart');
export const removeFromCart = (productId) => axios.delete(`/api/cart/${productId}`);
export const updateCartItem = (productId, quantity) =>
  axios.put(`/api/cart/${productId}`, { quantity });
export const checkout = () => axios.post('/api/cart/checkout');
export const createCartCheckoutSession = () => axios.post('/api/payment/create-cart-checkout-session');
export const addToCart = (productId, quantity = 1) =>
  axios.post('/api/cart/add', { productId, quantity });