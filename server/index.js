const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Product = require('./models/Product');
require('dotenv').config();

const app = express();

// Stripe webhook route must be defined before express.json()
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

// Other middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/protected', require('./routes/protectedroute'));
app.use('/api/products', require('./routes/product'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/shopkeeper', require('./routes/Admin'));
app.use('/api/user', require('./routes/user'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/orders', require('./routes/order'));
app.use("/api/admin",require('./routes/Admin'))

// MongoDB connection and server start
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));
