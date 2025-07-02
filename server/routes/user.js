const express = require('express');
const { getProfile, updateProfile, addAddress, removeAddress, addToWishlist, removeFromWishlist, getWishlist, getOrders } = require('../controllers/userController');
const { getOrderById } = require('../controllers/orderController'); // Add this import
const firebaseAuth = require('../middleware/auth');

const router = express.Router();

router.get('/profile', firebaseAuth, getProfile);
router.put('/profile', firebaseAuth, updateProfile);
router.post('/address', firebaseAuth, addAddress);
router.delete('/address/:addressId', firebaseAuth, removeAddress);
router.post('/wishlist', firebaseAuth, addToWishlist);
router.delete('/wishlist/:productId', firebaseAuth, removeFromWishlist);
router.get('/wishlist', firebaseAuth, getWishlist);
router.get('/orders', firebaseAuth, getOrders);
router.get('/orders/:id', firebaseAuth, getOrderById); // Add this line

module.exports = router;