const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Product = require('./models/Product');
require('dotenv').config();


// Initialize Firebase client-side verification (bypasses Admin SDK issues)
require('./config/firebase-client');

const app = express();


app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));


app.use(cors({
  origin:'https://e-commerce-bjhg.vercel.app',
  credentials: true
}));
app.options('*', cors());
app.use(express.json());



app.get('/', (req, res) => {
  res.status(200).json({
    message: 'E-commerce API is running successfully',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});


app.use('/api/auth', require('./routes/auth'));
app.use('/api/protected', require('./routes/protectedroute'));
app.use('/api/products', require('./routes/product'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/shopkeeper', require('./routes/Admin'));
app.use('/api/user', require('./routes/user'));
// app.use('/api/payment', require('./routes/payment'));
app.use('/api/orders', require('./routes/order'));



const PORT = process.env.PORT || 5000;

// MongoDB connection and server start
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
