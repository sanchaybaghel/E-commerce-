const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category:String,
  price: { type: Number, required: true },
  image: String,
  images: [String], 
  category: String,
  shopkeeper: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User ' },
      name: String,
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  rating: { type: Number, default: 0 }, 
  numReviews: { type: Number, default: 0 },
  stock: { type: Number, default: 1 }, 
  status: { type: String, default: 'active' }, 
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);