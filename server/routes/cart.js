const express = require('express');
const { addToCart, viewCart, removeFromCart, updateCartItem, checkout } = require('../controllers/cartController');
const firebaseAuth = require('../middleware/auth');

const router = express.Router();

router.post('/add', firebaseAuth, addToCart);
router.get('/', firebaseAuth, viewCart);
router.delete('/:productId', firebaseAuth, removeFromCart);
router.put('/:productId', firebaseAuth, updateCartItem);
router.post('/checkout', firebaseAuth, checkout);

module.exports = router;