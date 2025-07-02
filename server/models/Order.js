const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number
    }
  ],
  total: Number,
  status: {
    type: String,
    default: 'Placed',
    enum: [
      // Customer visible statuses
      'Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled',
      // Return/Exchange workflow
      'Return Requested', 'Return Approved', 'Return Rejected', 'Return Initiated',
      'Return in Transit', 'Return Delivered', 'Refund Processed',
      'Exchange Requested', 'Exchange Approved', 'Exchange Rejected', 'Exchange Initiated',
      'Exchange in Transit', 'Exchange Delivered', 'Exchange Failed',
      // Delivery issues
      'Failed Delivery'
    ]
  },
  // Admin-specific fields
  trackingNumber: { type: String },
  estimatedDelivery: { type: Date },
  adminNotes: { type: String },

  // Customer-specific fields
  customerNotes: { type: String },

  statusHistory: [
    {
      status: String,
      reason: String,
      adminNotes: String,
      trackingNumber: String,
      estimatedDelivery: Date,
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      updatedAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
