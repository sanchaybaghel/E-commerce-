const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, unique: true, sparse: true }, 
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['shopkeeper', 'admin','customer'], default: 'customer' },
  cart: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 }
    }
  ],
  addresses: [
    {
      label: String,
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
      phone: String
    }
  ],
  wishlist: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
  ],
  // No password field!
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);