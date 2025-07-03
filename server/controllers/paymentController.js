const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const { default: mongoose } = require('mongoose');
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

exports.createPaymentIntent = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: product.price * 100,
      currency: 'inr',
      payment_method_types: ['card'],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.log("err in create payment intent", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.createCheckoutSession = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    const userId=await User.findOne({firebaseUid:req.user.uid}).select('_id')
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    function withHttps(url) {
  if (!/^https?:\/\//i.test(url)) {
    return 'https://' + url;
  }
  return url;
}

const frontendUrl = withHttps(process.env.FRONTEND_URL || 'https://e-commerce-bjhg.vercel.app');

const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [{
    price_data: {
      currency: 'inr',
      product_data: { name: product.name },
      unit_amount: product.price * 100,
    },
    quantity,
  }],
  mode: 'payment',
  success_url: `${frontendUrl}/success`,
  cancel_url: `${frontendUrl}/cancel`,
  metadata: {
    productId: product._id.toString(),
    quantity: quantity.toString(),
    userId: userId._id.toString(),
    type: 'single_product'
  }
});
    res.json({ id: session.id });
  } catch (err) {
    console.log("err in create checkout session", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.createCartCheckoutSession = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid }).populate('cart.product');
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.cart.length) return res.status(400).json({ message: 'Cart is empty' });

    // Check stock for all items
    for (const item of user.cart) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${item.product.name}` });
      }
    }

    // Create line items for Stripe
    const lineItems = user.cart.map(item => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.product.name,
          images: item.product.images ? [item.product.images[0]] : []
        },
        unit_amount: item.product.price * 100,
      },
      quantity: item.quantity,
    }));

    // Calculate total
    const total = user.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'https://e-commerce-bjhg.vercel.app'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'https://e-commerce-bjhg.vercel.app'}/cart`,
      metadata: {
        userId: user._id.toString(),
        type: 'cart_checkout',
        cartItems: JSON.stringify(user.cart.map(item => ({
          productId: item.product._id.toString(),
          quantity: item.quantity
        })))
      }
    });

    res.json({ id: session.id });
  } catch (err) {
    console.log("Cart checkout error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const paymentIntentId = session.payment_intent;
    const checkoutType = session.metadata.type;

    try {
      if (checkoutType === 'cart_checkout') {
        // Handle cart checkout
        const cartItems = JSON.parse(session.metadata.cartItems);
        const user = await User.findById(userId);

        if (!user) {
          console.error('User not found for cart checkout:', userId);
          return res.json({ received: true });
        }

        // Update product stock
        for (const item of cartItems) {
          const product = await Product.findById(item.productId);
          if (product) {
            product.stock -= Number(item.quantity);
            await product.save();
          }
        }

        // Create order
        await Order.create({
          user: userId,
          items: cartItems.map(item => ({
            product: item.productId,
            quantity: Number(item.quantity)
          })),
          total: session.amount_total / 100,
          paymentIntentId,
          status: 'paid'
        });

        // Clear user's cart
        user.cart = [];
        await user.save();

        console.log('Cart checkout completed for user:', userId);

      } else {
        // Handle single product checkout (existing logic)
        const { productId, quantity } = session.metadata;
        const product = await Product.findById(productId);

        if (product) {
          product.stock -= Number(quantity);
          await product.save();
        }

        await Order.create({
          user: userId,
          items: [
            {
              product: productId,
              quantity: Number(quantity)
            }
          ],
          total: session.amount_total / 100,
          paymentIntentId,
          status: 'paid'
        });
      }

      // Send confirmation email (optional)
      try {
        const nodemailer = require('nodemailer');
        const user = await User.findById(userId);

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          });

          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Order Confirmation',
            text: `Thank you for your order! Amount: ₹${session.amount_total / 100}`,
          });
        }
      } catch (emailError) {
        console.error('Email sending failed:', emailError.message);
      }

    } catch (error) {
     
      console.error('Webhook processing error:', error.message);
    }
  }

  res.json({ received: true });
};