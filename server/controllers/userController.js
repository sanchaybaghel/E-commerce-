const { messaging } = require('firebase-admin');
const firebaseAuth = require('../middleware/auth');
const User = require('../models/User');
const Order = require('../models/Order'); 

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    // Find user by Firebase UID
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      cart: user.cart,
      addresses: user.addresses,
      wishlist: user.wishlist
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.uid || req.user.id;
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(userId, { name, email }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add address
exports.addAddress = async (req, res) => {
  try {
    const userId = req.user.uid || req.user.id;
    const address = req.body;
    const user = await User.findOne({firebaseUid:req.user.uid});
    user.addresses.push(address);
    await user.save();
    res.json(user.addresses);
  } catch (err) {
    console.log("err",err.message)
    res.status(500).json({ message: err.message });
  }
};

// Remove address
exports.removeAddress = async (req, res) => {
  try {
    const userId = req.user.uid || req.user.id;
    const { addressId } = req.params;
    const user = await User.findById(userId);
    user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);
    await user.save();
    res.json(user.addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user.uid || req.user.id;
    const { productId } = req.body;
    const user = await User.findById(userId);
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.uid || req.user.id;
    const { productId } = req.params;
    const user = await User.findById(userId);
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// View wishlist
exports.getWishlist = async (req, res) => {
  try {
    // Correct usage:
    const user = await User.findOne({ firebaseUid: req.user.uid }).populate('wishlist');
    if (!user) return res.status(400).json({ message: 'User not found' });
    res.json({ wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get orders
exports.getOrders = async (req, res) => {
  console.log("enter into orders")
  try {
    // Find the user by Firebase UID
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Now find orders by user._id
    const orders = await Order.find({ user: user._id }).populate('items.product');
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};