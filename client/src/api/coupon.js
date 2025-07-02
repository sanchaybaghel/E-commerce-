import axios from './axios'
export const createCoupon = (coupon) => axios.post('/api/coupons', coupon);
export const getCoupons = () => axios.get('/api/coupons');
export const deleteCoupon = (id) => axios.delete(`/api/coupons/${id}`);