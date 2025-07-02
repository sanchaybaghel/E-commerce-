const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const firebaseAuth = require('../middleware/auth');

router.post('/create-payment-intent', firebaseAuth, paymentController.createPaymentIntent);
router.post('/create-checkout-session', firebaseAuth, paymentController.createCheckoutSession);
router.post('/create-cart-checkout-session', firebaseAuth, paymentController.createCartCheckoutSession);

// Stripe webhook - raw body parser is already applied in server.js
router.post('/webhook', paymentController.stripeWebhook);

module.exports = router;
