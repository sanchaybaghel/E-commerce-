const express = require('express');
const { getMyProducts, updateProduct, deleteProduct, getAnalytics, getMyOrders } = require('../controllers/AdminController');
const { getAllUsers } = require('../controllers/AdminController');
const firebaseAuth = require('../middleware/auth');

const router = express.Router();

router.get('/products', firebaseAuth, getMyProducts);
router.get('/orders', firebaseAuth, getMyOrders);
router.put('/products/:productId', firebaseAuth, updateProduct);
router.delete('/products/:productId', firebaseAuth, deleteProduct);
router.get('/analytics', firebaseAuth, getAnalytics);
router.get('/users', firebaseAuth, getAllUsers);

module.exports = router;