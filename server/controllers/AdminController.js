const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

exports.getMyProducts = async (req, res) => {
  try {
    const shopkeeperId = req.user.uid || req.user.id;
    const products = await Product.find({ shopkeeper: shopkeeperId });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const shopkeeperId = await User.findOne({firebaseUid:req.user.uid})
    const myProducts = await Product.find({ shopkeeper: shopkeeperId }).select('_id');
    const myProductIds = myProducts.map(p => p._id);
    const orders = await Order.find({ "items.product": { $in: myProductIds } })
      .populate('user', 'name email')
      .populate('items.product', 'name price');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const shopkeeperId = req.user.uid || req.user.id;
    const { productId } = req.params;
    const updateData = req.body;
    const product = await Product.findOneAndUpdate(
      { _id: productId, shopkeeper: shopkeeperId },
      updateData,
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found or not authorized' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const shopkeeperId = req.user.uid || req.user.id;
    const { productId } = req.params;
    const product = await Product.findOneAndDelete({ _id: productId, shopkeeper: shopkeeperId });
    if (!product) return res.status(404).json({ message: 'Product not found or not authorized' });

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const shopkeeperId = req.user.uid || req.user.id;
    const totalProducts = await Product.countDocuments({ shopkeeper: shopkeeperId });
    const myProducts = await Product.find({ shopkeeper: shopkeeperId }).select('_id');
    const myProductIds = myProducts.map(p => p._id);
    const orders = await Order.find({ "items.product": { $in: myProductIds } });
    const totalOrders = orders.length;
    const totalSales = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const productSales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (myProductIds.some(id => id.equals(item.product))) {
          productSales[item.product] = (productSales[item.product] || 0) + item.quantity;
        }
      });
    });
    const topProducts = Object.entries(productSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([productId, quantity]) => ({ productId, quantity }));
    res.json({
      totalProducts,
      totalOrders,
      totalSales,
      topProducts
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Don't send password hashes
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};