const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// Admin-only order status update with comprehensive workflow
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, adminNotes, trackingNumber, estimatedDelivery } = req.body;

    // Find the user making the request
    const adminUser = await User.findOne({ firebaseUid: req.user.uid });
    if (!adminUser || !['admin', 'shopkeeper'].includes(adminUser.role)) {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    // Find the order
    const order = await Order.findById(orderId).populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Define admin workflow transitions
    const adminWorkflow = {
      'Placed': ['Processing', 'Cancelled'],
      'Processing': ['Shipped', 'Cancelled'],
      'Shipped': ['Out for Delivery', 'Delivered', 'Return Initiated'],
      'Out for Delivery': ['Delivered', 'Failed Delivery'],
      'Delivered': ['Return Initiated', 'Exchange Initiated'],
      'Failed Delivery': ['Shipped', 'Return Initiated'],
      'Return Requested': ['Return Approved', 'Return Rejected'],
      'Return Approved': ['Return Initiated', 'Return Rejected'],
      'Return Initiated': ['Return in Transit', 'Return Cancelled'],
      'Return in Transit': ['Return Delivered', 'Return Failed'],
      'Return Delivered': ['Refund Processed'],
      'Exchange Requested': ['Exchange Approved', 'Exchange Rejected'],
      'Exchange Approved': ['Exchange Initiated'],
      'Exchange Initiated': ['Exchange in Transit'],
      'Exchange in Transit': ['Exchange Delivered', 'Exchange Failed'],
      'Cancelled': [], // Final state
      'Refund Processed': [] // Final state
    };

    // Validate status transition
    if (!adminWorkflow[order.status] || !adminWorkflow[order.status].includes(status)) {
      return res.status(400).json({
        message: `Invalid status transition from "${order.status}" to "${status}"`,
        allowedStatuses: adminWorkflow[order.status] || []
      });
    }

    // Handle stock management for cancellations and returns
    if (status === 'Cancelled' || status === 'Refund Processed') {
      for (const item of order.items) {
        const product = await Product.findById(item.product._id);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    }

    // Create status update object
    const statusUpdate = {
      status,
      adminNotes: adminNotes || '',
      updatedBy: adminUser._id,
      updatedAt: new Date()
    };

    // Add tracking information if provided
    if (trackingNumber) statusUpdate.trackingNumber = trackingNumber;
    if (estimatedDelivery) statusUpdate.estimatedDelivery = new Date(estimatedDelivery);

    // Update the order
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        status,
        trackingNumber: trackingNumber || order.trackingNumber,
        estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : order.estimatedDelivery,
        adminNotes: adminNotes || order.adminNotes,
        statusHistory: [
          ...(order.statusHistory || []),
          statusUpdate
        ]
      },
      { new: true }
    ).populate('items.product').populate('user', 'name email');

    res.json({
      message: `Order status updated to ${status}`,
      order: updatedOrder
    });

  } catch (err) {
    console.error('Admin order status update error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getLatestOrder = async (req, res) => {
  try {
    const userId = await User.findOne({firebaseUid:req.user.uid}).select('_id')
    const order = await Order.findOne({ user: userId })
      .sort({ createdAt: -1 })
      .populate('items.product');
    if (!order) return res.status(400).json({ message: 'No order found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserOrders = async (req, res) => {

  try {
    const userId = await User.findOne({firebaseUid:req.user.uid}).select('_id')
    console.log("userId",userId)
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('items.product');
    
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product')
      .populate('user');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Customer order status update with business logic
exports.updateCustomerOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, reason } = req.body;

    // Find the user
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Find the order and verify ownership
    const order = await Order.findById(orderId).populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Verify the order belongs to the customer
    if (order.user.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'You can only modify your own orders' });
    }

    // Define allowed status transitions for customers (limited compared to admin)
    const allowedTransitions = {
      'Placed': ['Cancelled'],
      'Processing': ['Cancelled'], // Allow cancellation during processing only
      'Shipped': [], // Cannot cancel once shipped, must contact support
      'Out for Delivery': [], // Cannot cancel during delivery
      'Delivered': ['Return Requested', 'Exchange Requested'], // Can request return/exchange after delivery
      'Failed Delivery': [], // Admin handles this
      'Return Requested': [], // Cannot cancel return request once made
      'Return Approved': [], // Admin controlled
      'Exchange Requested': [], // Cannot cancel exchange request once made
      'Exchange Approved': [], // Admin controlled
      'Cancelled': [], // Final state
      'Refund Processed': [] // Final state
    };

    // Check if the status transition is allowed
    if (!allowedTransitions[order.status] || !allowedTransitions[order.status].includes(status)) {
      return res.status(400).json({
        message: `Cannot change order status from "${order.status}" to "${status}"`,
        allowedStatuses: allowedTransitions[order.status] || []
      });
    }

    // Additional business logic for specific status changes
    if (status === 'Cancelled') {
      // Check if order can still be cancelled (only Placed/Processing)
      if (!['Placed', 'Processing'].includes(order.status)) {
        return res.status(400).json({
          message: 'Cannot cancel order at this stage. Please contact customer support for assistance.'
        });
      }

      // Restore product stock when cancelling
      for (const item of order.items) {
        const product = await Product.findById(item.product._id);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    }

    // Validate return/exchange requests
    if (status === 'Return Requested' || status === 'Exchange Requested') {
      if (order.status !== 'Delivered') {
        return res.status(400).json({
          message: 'Returns and exchanges can only be requested for delivered orders.'
        });
      }

      // Check if return/exchange window is still open (e.g., 30 days)
      const deliveryDate = order.statusHistory?.find(h => h.status === 'Delivered')?.updatedAt || order.updatedAt;
      const daysSinceDelivery = Math.floor((new Date() - new Date(deliveryDate)) / (1000 * 60 * 60 * 24));

      if (daysSinceDelivery > 30) {
        return res.status(400).json({
          message: 'Return/exchange window has expired. Returns and exchanges are only allowed within 30 days of delivery.'
        });
      }
    }

    // Update the order with new status and reason
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        status,
        customerNotes: reason,
        statusHistory: [
          ...(order.statusHistory || []),
          {
            status,
            reason: reason || `Customer requested ${status.toLowerCase()}`,
            updatedBy: user._id,
            updatedAt: new Date()
          }
        ]
      },
      { new: true }
    ).populate('items.product').populate('user', 'name email');

    res.json({
      message: `Order status updated to ${status}`,
      order: updatedOrder
    });

  } catch (err) {
    console.error('Customer order status update error:', err);
    res.status(500).json({ message: err.message });
  }
};