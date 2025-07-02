import axios from './axios';

export const getProfile = () => axios.get('/api/user/profile');
export const updateProfile = (profile) => axios.put('/api/user/profile', profile);
export const addAddress = (address) => axios.post('/api/user/address', address);
export const removeAddress = (addressId) => axios.delete(`/api/user/address/${addressId}`);
export const getWishlist = () => axios.get('/api/user/wishlist');
export const addToWishlist = (productId) => axios.post('/api/user/wishlist', { productId });
export const removeFromWishlist = (productId) => axios.delete(`/api/user/wishlist/${productId}`);

// Add these for admin:
export const getAllUsers = () => axios.get('/api/admin/users', { withCredentials: true });
export const deleteUser = (id) => axios.delete(`/api/users/${id}`, { withCredentials: true });