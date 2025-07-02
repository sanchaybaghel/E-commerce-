const express = require('express');
const { updateOrderStatus, getLatestOrder, getUserOrders, updateCustomerOrderStatus } = require('../controllers/orderController');
const firebaseAuth = require('../middleware/auth');
const { getAdminOrders } = require('../controllers/cartController');

const router = express.Router();


// Update order status (admin/shopkeeper only)
router.put('/:orderId/status', firebaseAuth, updateOrderStatus);

// Update order status (customer actions like cancel, return request)
router.put('/:orderId/customer-status', firebaseAuth, updateCustomerOrderStatus);

// Get the latest order (authenticated users)
router.get('/latest', firebaseAuth, getLatestOrder);

// Get user's orders (authenticated users)
router.get('/my', firebaseAuth, getUserOrders);
module.exports = router;